"""Generate Postman Collection with real API responses.

This script:
1. Starts the API in Docker
2. Tests all endpoints
3. Captures real responses
4. Generates Postman Collection JSON
5. Stops Docker containers
"""

import json
import subprocess
import time
from typing import Any, Dict

import requests

BASE_URL = "http://localhost:8000"


def run_command(cmd: str) -> subprocess.CompletedProcess:
    """Run shell command and return result."""
    return subprocess.run(
        cmd, shell=True, capture_output=True, text=True, cwd="../"
    )


def wait_for_api(max_attempts: int = 30) -> bool:
    """Wait for API to be ready."""
    for i in range(max_attempts):
        try:
            response = requests.get(f"{BASE_URL}/health", timeout=2)
            if response.status_code == 200:
                print(f"✅ API ready after {i+1} attempts")
                return True
        except requests.exceptions.RequestException:
            time.sleep(1)
    return False


def capture_real_responses() -> Dict[str, Any]:
    """Capture real API responses for all endpoints."""
    print("\n=== CAPTURING REAL API RESPONSES ===\n")
    
    responses = {}
    
    # 1. Health Check
    print("1️⃣ GET /health")
    responses["health"] = requests.get(f"{BASE_URL}/health").json()
    
    # 2. List Containers
    print("2️⃣ GET /api/v1/containers")
    responses["containers_list"] = requests.get(
        f"{BASE_URL}/api/v1/containers?all=true"
    ).json()
    
    # Get first container name for further tests
    container_name = (
        responses["containers_list"][0]["name"]
        if responses["containers_list"]
        else "mylocalplace-api"
    )
    
    # 3. Container Details
    print(f"3️⃣ GET /api/v1/containers/{container_name}")
    responses["container_details"] = requests.get(
        f"{BASE_URL}/api/v1/containers/{container_name}"
    ).json()
    
    # 4. Container Logs
    print(f"4️⃣ GET /api/v1/containers/{container_name}/logs")
    responses["container_logs"] = requests.get(
        f"{BASE_URL}/api/v1/containers/{container_name}/logs?tail=50"
    ).json()
    
    # 5. Container Stats
    print(f"5️⃣ GET /api/v1/containers/{container_name}/stats")
    responses["container_stats"] = requests.get(
        f"{BASE_URL}/api/v1/containers/{container_name}/stats"
    ).json()
    
    # 6. Start Container (already running)
    print(f"6️⃣ POST /api/v1/containers/{container_name}/start")
    responses["container_start_running"] = requests.post(
        f"{BASE_URL}/api/v1/containers/{container_name}/start"
    ).json()
    
    # 7. System Metrics
    print("7️⃣ GET /api/v1/system/metrics")
    responses["system_metrics"] = requests.get(
        f"{BASE_URL}/api/v1/system/metrics"
    ).json()
    
    # 8. Error - Container Not Found
    print("8️⃣ GET /api/v1/containers/nonexistent (404)")
    resp_404 = requests.get(
        f"{BASE_URL}/api/v1/containers/container-nao-existe"
    )
    responses["error_404"] = resp_404.json()
    
    # 9. Error - Validation
    print("9️⃣ GET /api/v1/containers/{name}/logs?tail=2000 (422)")
    resp_422 = requests.get(
        f"{BASE_URL}/api/v1/containers/{container_name}/logs?tail=2000"
    )
    responses["error_422"] = resp_422.json()
    
    print("\n✅ All responses captured!\n")
    return responses


def main():
    """Main execution."""
    print("="*60)
    print("POSTMAN COLLECTION GENERATOR - MyLocalPlace v2.0")
    print("="*60)
    
    # Start Docker
    print("\n🐳 Starting Docker...")
    run_command("docker-compose up -d")
    time.sleep(3)
    
    # Wait for API
    if not wait_for_api():
        print("❌ API failed to start")
        return
    
    # Capture responses
    responses = capture_real_responses()
    
    # Save to file
    output_file = "../docs/postman_responses_real.json"
    with open(output_file, "w") as f:
        json.dump(responses, f, indent=2)
    
    print(f"💾 Saved to: {output_file}")
    
    # Stop Docker
    print("\n🛑 Stopping Docker...")
    run_command("docker-compose down")
    
    print("\n✅ DONE! Use responses to create Postman Collection")
    print("="*60)


if __name__ == "__main__":
    main()

