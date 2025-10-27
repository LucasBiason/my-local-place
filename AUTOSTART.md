# Auto-Start Configuration

## Quick Start (Manual)

Run essential services on demand:
```bash
./autostart-essential.sh
```

This starts:
- PostgreSQL
- Dashboard

## Auto-Start on Boot (Systemd)

### 1. Install systemd service

```bash
sudo cp /tmp/mylocalplace.service /etc/systemd/system/
sudo systemctl daemon-reload
```

### 2. Enable auto-start

```bash
sudo systemctl enable mylocalplace.service
```

### 3. Start now

```bash
sudo systemctl start mylocalplace.service
```

### 4. Check status

```bash
sudo systemctl status mylocalplace.service
```

### 5. Disable auto-start (if needed)

```bash
sudo systemctl disable mylocalplace.service
sudo systemctl stop mylocalplace.service
```

## What Gets Started

- PostgreSQL (port 5432)
- Dashboard (port 8501)

Other services remain stopped until you start them manually with:
```bash
make up
```
