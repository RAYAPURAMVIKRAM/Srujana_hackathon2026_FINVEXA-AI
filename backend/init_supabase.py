import os
import requests
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY", "")
SUPABASE_PUBLISHABLE_KEY = os.getenv("SUPABASE_PUBLISHABLE_KEY", "")

def init_buckets():
    if not SUPABASE_URL or not SUPABASE_SECRET_KEY:
        print("Missing SUPABASE_URL or SUPABASE_SECRET_KEY")
        return False

    print(f"Connecting to Supabase at: {SUPABASE_URL}")
    headers = {
        "Authorization": f"Bearer {SUPABASE_SECRET_KEY}",
        "apikey": SUPABASE_SECRET_KEY,
        "Content-Type": "application/json"
    }

    # 1. List existing buckets
    bucket_url = f"{SUPABASE_URL}/storage/v1/bucket"
    try:
        res = requests.get(bucket_url, headers=headers, timeout=10)
        print(f"List buckets status: {res.status_code}")
        existing_buckets = []
        if res.status_code == 200:
            existing_buckets = [b["id"] for b in res.json()]
            print(f"Existing buckets: {existing_buckets}")
        else:
            print(f"List buckets response: {res.text}")
    except Exception as e:
        print(f"Error connecting to Supabase storage: {e}")
        return False

    target_buckets = [
        {"id": "finvexa-assets", "public": True},
        {"id": "finvexa-documents", "public": True}
    ]

    for b in target_buckets:
        b_id = b["id"]
        if b_id in existing_buckets:
            print(f"Bucket '{b_id}' already exists.")
            # Ensure it's public
            try:
                update_url = f"{SUPABASE_URL}/storage/v1/bucket/{b_id}"
                up_res = requests.put(update_url, headers=headers, json={"public": True}, timeout=10)
                print(f"Updated public access for '{b_id}': status {up_res.status_code}")
            except Exception as e:
                print(f"Failed to update bucket {b_id}: {e}")
        else:
            print(f"Creating bucket '{b_id}' (public: {b['public']})...")
            try:
                payload = {
                    "id": b_id,
                    "name": b_id,
                    "public": b["public"],
                    "file_size_limit": None,
                    "allowed_mime_types": None
                }
                c_res = requests.post(bucket_url, headers=headers, json=payload, timeout=10)
                print(f"Create bucket '{b_id}' status: {c_res.status_code}, response: {c_res.text}")
            except Exception as e:
                print(f"Failed to create bucket {b_id}: {e}")

    # Verify again
    try:
        check = requests.get(bucket_url, headers=headers, timeout=10)
        if check.status_code == 200:
            current = [b["id"] for b in check.json()]
            print(f"Verified current buckets: {current}")
            return True
    except Exception as e:
        print(f"Verification error: {e}")

    return True

if __name__ == "__main__":
    init_buckets()
