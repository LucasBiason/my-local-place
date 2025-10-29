"""Build Postman Collection from real API responses.

This script reads the real API responses captured from Docker
and generates a complete Postman Collection with real examples.
"""

import json
from pathlib import Path


def load_real_responses():
    """Load real API responses from JSON file."""
    responses_file = Path("../docs/postman_responses_real.json")
    with open(responses_file, "r") as f:
        return json.load(f)


def create_postman_collection(responses):
    """Create Postman Collection structure with real data."""
    
    collection = {
        "info": {
            "_postman_id": "mylocalplace-v2-api",
            "name": "MyLocalPlace v2.0 API",
            "description": "# MyLocalPlace v2.0 - Dashboard DevTools API\n\nAPI REST para gerenciar containers Docker via dashboard web.\n\n## Base URL\n\n```\nhttp://localhost:8000\n```\n\n## Tecnologias\n\n- FastAPI 0.115\n- Docker SDK 7.1\n- Python 3.13\n- Pydantic 2.10\n\n**Todos os exemplos foram capturados da API rodando em Docker com dados reais.**",
            "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        },
        "item": [],
        "variable": [
            {
                "key": "base_url",
                "value": "http://localhost:8000",
                "type": "string"
            }
        ]
    }
    
    # Health folder
    health_folder = {
        "name": "Health",
        "item": [
            {
                "name": "Health Check",
                "request": {
                    "method": "GET",
                    "header": [],
                    "url": {
                        "raw": "{{base_url}}/health",
                        "host": ["{{base_url}}"],
                        "path": ["health"]
                    },
                    "description": "Verifica status da API e conexão Docker.\n\n**Response real capturado do Docker.**"
                },
                "response": [
                    {
                        "name": "Success - API Healthy",
                        "originalRequest": {
                            "method": "GET",
                            "header": [],
                            "url": {
                                "raw": "{{base_url}}/health",
                                "host": ["{{base_url}}"],
                                "path": ["health"]
                            }
                        },
                        "status": "OK",
                        "code": 200,
                        "_postman_previewlanguage": "json",
                        "header": [{"key": "Content-Type", "value": "application/json"}],
                        "cookie": [],
                        "body": json.dumps(responses["health"], indent=2)
                    }
                ]
            }
        ]
    }
    
    # Containers folder
    containers_folder = {
        "name": "Containers",
        "item": [
            {
                "name": "List All Containers",
                "request": {
                    "method": "GET",
                    "header": [],
                    "url": {
                        "raw": "{{base_url}}/api/v1/containers?all=true",
                        "host": ["{{base_url}}"],
                        "path": ["api", "v1", "containers"],
                        "query": [{"key": "all", "value": "true"}]
                    },
                    "description": "Lista todos containers Docker.\n\n**Response real com 5 containers do sistema.**"
                },
                "response": [
                    {
                        "name": "Success - Lista Real de Containers",
                        "originalRequest": {
                            "method": "GET",
                            "header": [],
                            "url": {
                                "raw": "{{base_url}}/api/v1/containers?all=true",
                                "host": ["{{base_url}}"],
                                "path": ["api", "v1", "containers"],
                                "query": [{"key": "all", "value": "true"}]
                            }
                        },
                        "status": "OK",
                        "code": 200,
                        "_postman_previewlanguage": "json",
                        "header": [{"key": "Content-Type", "value": "application/json"}],
                        "cookie": [],
                        "body": json.dumps(responses["containers_list"], indent=2)
                    }
                ]
            },
            {
                "name": "Get Container Details",
                "request": {
                    "method": "GET",
                    "header": [],
                    "url": {
                        "raw": "{{base_url}}/api/v1/containers/mylocalplace-api",
                        "host": ["{{base_url}}"],
                        "path": ["api", "v1", "containers", "mylocalplace-api"]
                    },
                    "description": "Detalhes completos de um container.\n\n**Response real com state, health check e todas as informações.**"
                },
                "response": [
                    {
                        "name": "Success - Container Real",
                        "originalRequest": {
                            "method": "GET",
                            "header": [],
                            "url": {
                                "raw": "{{base_url}}/api/v1/containers/mylocalplace-api",
                                "host": ["{{base_url}}"],
                                "path": ["api", "v1", "containers", "mylocalplace-api"]
                            }
                        },
                        "status": "OK",
                        "code": 200,
                        "_postman_previewlanguage": "json",
                        "header": [{"key": "Content-Type", "value": "application/json"}],
                        "cookie": [],
                        "body": json.dumps(responses["container_details"], indent=2)
                    },
                    {
                        "name": "Error - Container Not Found (Real)",
                        "originalRequest": {
                            "method": "GET",
                            "header": [],
                            "url": {
                                "raw": "{{base_url}}/api/v1/containers/container-nao-existe",
                                "host": ["{{base_url}}"],
                                "path": ["api", "v1", "containers", "container-nao-existe"]
                            }
                        },
                        "status": "Not Found",
                        "code": 404,
                        "_postman_previewlanguage": "json",
                        "header": [{"key": "Content-Type", "value": "application/json"}],
                        "cookie": [],
                        "body": json.dumps(responses["error_404"], indent=2)
                    }
                ]
            },
            {
                "name": "Start Container",
                "request": {
                    "method": "POST",
                    "header": [],
                    "url": {
                        "raw": "{{base_url}}/api/v1/containers/mylocalplace-api/start",
                        "host": ["{{base_url}}"],
                        "path": ["api", "v1", "containers", "mylocalplace-api", "start"]
                    },
                    "description": "Inicia um container parado.\n\n**Response real de container já em execução.**"
                },
                "response": [
                    {
                        "name": "Success - Container Started (Real)",
                        "originalRequest": {
                            "method": "POST",
                            "header": [],
                            "url": {
                                "raw": "{{base_url}}/api/v1/containers/mylocalplace-api/start",
                                "host": ["{{base_url}}"],
                                "path": ["api", "v1", "containers", "mylocalplace-api", "start"]
                            }
                        },
                        "status": "OK",
                        "code": 200,
                        "_postman_previewlanguage": "json",
                        "header": [{"key": "Content-Type", "value": "application/json"}],
                        "cookie": [],
                        "body": json.dumps(responses["container_start_running"], indent=2)
                    }
                ]
            },
            {
                "name": "Get Container Logs",
                "request": {
                    "method": "GET",
                    "header": [],
                    "url": {
                        "raw": "{{base_url}}/api/v1/containers/mylocalplace-api/logs?tail=50",
                        "host": ["{{base_url}}"],
                        "path": ["api", "v1", "containers", "mylocalplace-api", "logs"],
                        "query": [{"key": "tail", "value": "50"}]
                    },
                    "description": "Logs reais do container.\n\n**19 linhas de log capturadas durante os testes.**"
                },
                "response": [
                    {
                        "name": "Success - Logs Reais",
                        "originalRequest": {
                            "method": "GET",
                            "header": [],
                            "url": {
                                "raw": "{{base_url}}/api/v1/containers/mylocalplace-api/logs?tail=50",
                                "host": ["{{base_url}}"],
                                "path": ["api", "v1", "containers", "mylocalplace-api", "logs"],
                                "query": [{"key": "tail", "value": "50"}]
                            }
                        },
                        "status": "OK",
                        "code": 200,
                        "_postman_previewlanguage": "json",
                        "header": [{"key": "Content-Type", "value": "application/json"}],
                        "cookie": [],
                        "body": json.dumps(responses["container_logs"], indent=2)
                    },
                    {
                        "name": "Error - Validation Tail > 1000 (Real)",
                        "originalRequest": {
                            "method": "GET",
                            "header": [],
                            "url": {
                                "raw": "{{base_url}}/api/v1/containers/mylocalplace-api/logs?tail=2000",
                                "host": ["{{base_url}}"],
                                "path": ["api", "v1", "containers", "mylocalplace-api", "logs"],
                                "query": [{"key": "tail", "value": "2000"}]
                            }
                        },
                        "status": "Unprocessable Entity",
                        "code": 422,
                        "_postman_previewlanguage": "json",
                        "header": [{"key": "Content-Type", "value": "application/json"}],
                        "cookie": [],
                        "body": json.dumps(responses["error_422"], indent=2)
                    }
                ]
            },
            {
                "name": "Get Container Stats",
                "request": {
                    "method": "GET",
                    "header": [],
                    "url": {
                        "raw": "{{base_url}}/api/v1/containers/mylocalplace-api/stats",
                        "host": ["{{base_url}}"],
                        "path": ["api", "v1", "containers", "mylocalplace-api", "stats"]
                    },
                    "description": "Estatísticas reais de CPU, RAM e Network.\n\n**Dados capturados durante execução no Docker.**"
                },
                "response": [
                    {
                        "name": "Success - Stats Reais",
                        "originalRequest": {
                            "method": "GET",
                            "header": [],
                            "url": {
                                "raw": "{{base_url}}/api/v1/containers/mylocalplace-api/stats",
                                "host": ["{{base_url}}"],
                                "path": ["api", "v1", "containers", "mylocalplace-api", "stats"]
                            }
                        },
                        "status": "OK",
                        "code": 200,
                        "_postman_previewlanguage": "json",
                        "header": [{"key": "Content-Type", "value": "application/json"}],
                        "cookie": [],
                        "body": json.dumps(responses["container_stats"], indent=2)
                    }
                ]
            }
        ]
    }
    
    # System folder
    system_folder = {
        "name": "System",
        "item": [
            {
                "name": "Get System Metrics",
                "request": {
                    "method": "GET",
                    "header": [],
                    "url": {
                        "raw": "{{base_url}}/api/v1/system/metrics",
                        "host": ["{{base_url}}"],
                        "path": ["api", "v1", "system", "metrics"]
                    },
                    "description": "Métricas reais do sistema host.\n\n**CPU, RAM e Disk do sistema durante os testes.**"
                },
                "response": [
                    {
                        "name": "Success - Metrics Reais",
                        "originalRequest": {
                            "method": "GET",
                            "header": [],
                            "url": {
                                "raw": "{{base_url}}/api/v1/system/metrics",
                                "host": ["{{base_url}}"],
                                "path": ["api", "v1", "system", "metrics"]
                            }
                        },
                        "status": "OK",
                        "code": 200,
                        "_postman_previewlanguage": "json",
                        "header": [{"key": "Content-Type", "value": "application/json"}],
                        "cookie": [],
                        "body": json.dumps(responses["system_metrics"], indent=2)
                    }
                ]
            }
        ]
    }
    
    # Add all folders
    collection["item"] = [health_folder, containers_folder, system_folder]
    
    return collection


def main():
    """Main execution."""
    print("="*60)
    print("BUILDING POSTMAN COLLECTION FROM REAL DATA")
    print("="*60)
    
    # Load real responses
    print("\n📂 Loading real API responses...")
    responses = load_real_responses()
    print(f"✅ Loaded {len(responses)} response types")
    
    # Create collection
    print("\n🏗️  Building Postman Collection...")
    collection = create_postman_collection(responses)
    
    # Save collection
    output_file = "../docs/MyLocalPlace_API.postman_collection.json"
    with open(output_file, "w") as f:
        json.dump(collection, f, indent=2)
    
    print(f"✅ Saved to: {output_file}")
    
    # Summary
    print("\n📊 COLLECTION SUMMARY:")
    print(f"  - 3 folders (Health, Containers, System)")
    print(f"  - 6 requests")
    print(f"  - 9 real examples")
    print(f"  - Health: 1 exemplo")
    print(f"  - Containers: 6 exemplos (success + errors)")
    print(f"  - System: 1 exemplo")
    
    print("\n✅ POSTMAN COLLECTION READY!")
    print("   Import no Postman: File > Import > " + output_file)
    print("="*60)


if __name__ == "__main__":
    main()

