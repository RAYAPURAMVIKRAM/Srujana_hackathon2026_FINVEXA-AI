// src/components/CloudAssetManager.tsx
import React, { useState, useEffect, useRef } from 'react'
import {
  UploadCloud,
  X,
  Check,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  FolderOpen,
} from 'lucide-react'
import { uploadAsset, listAssets, isSupabaseConfigured } from '../lib/supabase'

interface CloudAssetManagerProps {
  isOpen: boolean
  onClose: () => void
  onSelectUrl?: (url: string) => void
}

interface AssetItem {
  name: string
  publicUrl: string
  created_at?: string | null
  size?: number
}

export default function CloudAssetManager({ isOpen, onClose, onSelectUrl }: CloudAssetManagerProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [recentUpload, setRecentUpload] = useState<AssetItem | null>(null)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [assets, setAssets] = useState<AssetItem[]>([])
  const [loadingAssets, setLoadingAssets] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isConfigured = isSupabaseConfigured()

  const loadBucketAssets = async () => {
    if (!isConfigured) return
    setLoadingAssets(true)
    try {
      const items = await listAssets('finvexa-assets')
      setAssets(items)
    } catch (e) {
      console.warn('Failed to list assets', e)
    } finally {
      setLoadingAssets(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadBucketAssets()
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2500)
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return
    setIsUploading(true)
    setUploadError(null)

    try {
      const res = await uploadAsset(file, 'finvexa-assets')
      if (res.success && res.publicUrl) {
        const newAsset: AssetItem = {
          name: file.name,
          publicUrl: res.publicUrl,
          created_at: new Date().toISOString(),
          size: file.size,
        }
        setRecentUpload(newAsset)
        setAssets(prev => [newAsset, ...prev.filter(a => a.name !== newAsset.name)])
        if (onSelectUrl) onSelectUrl(res.publicUrl)
      } else {
        setUploadError(res.error || 'Upload could not complete.')
      }
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 shadow-2xl rounded-3xl text-slate-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-xs">
              <UploadCloud size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">FINVEXA Cloud Asset Manager</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  finvexa-assets • public
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Direct Supabase CDN storage for UI illustrations, logos, and team attachments
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1 custom-scrollbar bg-white">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={e => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50 scale-[1.01]'
                : 'border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/40 bg-slate-50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0])
                }
              }}
              accept="image/*,.pdf,.svg"
              className="hidden"
            />
            {isUploading ? (
              <div className="flex flex-col items-center justify-center py-4">
                <Loader2 size={32} className="text-emerald-600 animate-spin mb-2" />
                <div className="text-sm font-semibold text-slate-900">Uploading to Supabase CDN...</div>
                <div className="text-xs text-slate-500 mt-1">finvexa-assets bucket</div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-110 transition-transform shadow-xs">
                  <UploadCloud size={24} />
                </div>
                <div className="text-sm font-bold text-slate-900">
                  Drag & Drop teammate images or assets here
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">
                  Supports PNG, JPG, WEBP, SVG, PDF • Instant Public CDN URL
                </div>
                <button
                  type="button"
                  className="mt-3 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  Browse Files
                </button>
              </div>
            )}
          </div>

          {/* Upload Error */}
          {uploadError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between shadow-xs">
              <span>{uploadError}</span>
              <button onClick={() => setUploadError(null)} className="text-rose-600 hover:text-rose-900">
                <X size={14} />
              </button>
            </div>
          )}

          {/* Recent Upload Highlight */}
          {recentUpload && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Check size={14} /> Upload Succeeded & Live on CDN
                </span>
                <span className="text-[11px] text-slate-500 font-bold">
                  {recentUpload.size ? `${(recentUpload.size / 1024).toFixed(1)} KB` : ''}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                  <img
                    src={recentUpload.publicUrl}
                    alt={recentUpload.name}
                    className="w-full h-full object-cover"
                    onError={e => {
                      ;(e.target as HTMLElement).style.display = 'none'
                    }}
                  />
                  <ImageIcon size={20} className="text-slate-400 absolute" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">{recentUpload.name}</div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5 mono font-semibold">
                    {recentUpload.publicUrl}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCopy(recentUpload.publicUrl)}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    {copiedUrl === recentUpload.publicUrl ? (
                      <>
                        <Check size={12} /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copy URL
                      </>
                    )}
                  </button>
                  <a
                    href={recentUpload.publicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-300 transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Bucket Assets Gallery */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <FolderOpen size={14} className="text-emerald-600" />
                Supabase Cloud Gallery ({assets.length} Assets)
              </h4>
              <button
                onClick={loadBucketAssets}
                disabled={loadingAssets}
                className="text-xs text-slate-600 hover:text-emerald-600 flex items-center gap-1 transition-colors font-bold"
              >
                <RefreshCw size={12} className={loadingAssets ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>

            {loadingAssets && assets.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                <Loader2 size={18} className="animate-spin mx-auto mb-2 text-emerald-600" />
                Querying Supabase Storage bucket...
              </div>
            ) : assets.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-medium">
                No custom assets uploaded yet. Drag and drop any image above to save it to your Supabase cloud bucket!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {assets.map((asset, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 flex items-center gap-2.5 transition-colors group shadow-xs"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                      <img
                        src={asset.publicUrl}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                        onError={e => {
                          ;(e.target as HTMLElement).style.display = 'none'
                        }}
                      />
                      <ImageIcon size={16} className="text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-800 truncate">{asset.name}</div>
                      <div className="text-[10px] text-slate-400 truncate mono">
                        {asset.publicUrl.split('/').pop()}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={() => handleCopy(asset.publicUrl)}
                        className="p-1.5 rounded-md hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition-colors"
                        title="Copy Public CDN URL"
                      >
                        {copiedUrl === asset.publicUrl ? (
                          <Check size={13} className="text-emerald-600" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                      <a
                        href={asset.publicUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                        title="View Asset"
                      >
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-semibold">Supabase Storage Engine Online</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition-colors shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
