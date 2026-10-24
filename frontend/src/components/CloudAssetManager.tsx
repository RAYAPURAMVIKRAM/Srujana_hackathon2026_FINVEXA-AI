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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div
        className="glass-card w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] bg-[#0b1120]"
        style={{ borderRadius: '20px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <UploadCloud size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">FINVEXA Cloud Asset Manager</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  finvexa-assets • public
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Direct Supabase CDN storage for UI illustrations, logos, and team attachments
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
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
                ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
                : 'border-slate-700/80 hover:border-emerald-500/50 hover:bg-slate-800/40'
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
                <Loader2 size={32} className="text-emerald-400 animate-spin mb-2" />
                <div className="text-sm font-semibold text-white">Uploading to Supabase CDN...</div>
                <div className="text-xs text-slate-400 mt-1">finvexa-assets bucket</div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-3">
                <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud size={24} />
                </div>
                <div className="text-sm font-semibold text-slate-200">
                  Drag & Drop teammate images or assets here
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Supports PNG, JPG, WEBP, SVG, PDF • Instant Public CDN URL
                </div>
                <button
                  type="button"
                  className="mt-3 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition-colors"
                >
                  Browse Files
                </button>
              </div>
            )}
          </div>

          {/* Upload Error */}
          {uploadError && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
              <span>{uploadError}</span>
              <button onClick={() => setUploadError(null)} className="text-rose-400 hover:text-white">
                <X size={14} />
              </button>
            </div>
          )}

          {/* Recent Upload Highlight */}
          {recentUpload && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Check size={14} /> Upload Succeeded & Live on CDN
                </span>
                <span className="text-[11px] text-slate-400">
                  {recentUpload.size ? `${(recentUpload.size / 1024).toFixed(1)} KB` : ''}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                  <img
                    src={recentUpload.publicUrl}
                    alt={recentUpload.name}
                    className="w-full h-full object-cover"
                    onError={e => {
                      // Fallback icon if preview fails
                      ;(e.target as HTMLElement).style.display = 'none'
                    }}
                  />
                  <ImageIcon size={20} className="text-slate-600 absolute" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{recentUpload.name}</div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5 mono">
                    {recentUpload.publicUrl}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCopy(recentUpload.publicUrl)}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1 hover:bg-emerald-400 transition-colors shadow-sm"
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
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
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
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FolderOpen size={14} className="text-emerald-400" />
                Supabase Cloud Gallery ({assets.length} Assets)
              </h4>
              <button
                onClick={loadBucketAssets}
                disabled={loadingAssets}
                className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
              >
                <RefreshCw size={12} className={loadingAssets ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>

            {loadingAssets && assets.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                <Loader2 size={18} className="animate-spin mx-auto mb-2 text-emerald-400" />
                Querying Supabase Storage bucket...
              </div>
            ) : assets.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800 text-center text-xs text-slate-400">
                No custom assets uploaded yet. Drag and drop any image above to save it to your Supabase cloud bucket!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {assets.map((asset, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-emerald-500/40 flex items-center gap-2.5 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700/80 overflow-hidden flex items-center justify-center shrink-0">
                      <img
                        src={asset.publicUrl}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                        onError={e => {
                          ;(e.target as HTMLElement).style.display = 'none'
                        }}
                      />
                      <ImageIcon size={16} className="text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-slate-200 truncate">{asset.name}</div>
                      <div className="text-[10px] text-slate-500 truncate mono">
                        {asset.publicUrl.split('/').pop()}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={() => handleCopy(asset.publicUrl)}
                        className="p-1.5 rounded-md hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 transition-colors"
                        title="Copy Public CDN URL"
                      >
                        {copiedUrl === asset.publicUrl ? (
                          <Check size={13} className="text-emerald-400" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                      <a
                        href={asset.publicUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
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
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Supabase Storage Engine Online</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
