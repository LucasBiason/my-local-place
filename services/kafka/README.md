# Kafka Service

This service provides a local Apache Kafka cluster for distributed streaming and event-driven architectures.

## When to Use

- **Event-driven architectures** — Implement event sourcing and CQRS patterns
- **Real-time data pipelines** — Process streams of data in real-time
- **Microservices communication** — Decouple services using message streams
- **Data integration** — Integrate multiple data sources through streams

## Usage

```bash
# Start Kafka with Zookeeper (required)
docker compose up local-kafka local-zookeeper

# Start with other services (e.g., for data pipeline development)
docker compose up local-kafka local-zookeeper local-postgres local-redis
```

## Connection Details

- **Broker:** `localhost:9092` (Kafka broker port)
- **Zookeeper:** `localhost:2181` (Zookeeper port, internal only)
- **Schema Registry:** Not included by default (add if needed)

## Kafka Topics

### Creating a Topic

```bash
# Create a topic with default settings
docker compose exec local-kafka kafka-topics.sh \
  --create \
  --bootstrap-server localhost:9092 \
  --topic my-topic \
  --partitions 3 \
  --replication-factor 1

# List all topics
docker compose exec local-kafka kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --list
```

### Producing Messages

```bash
# Start producer
docker compose exec local-kafka kafka-console-producer.sh \
  --bootstrap-server localhost:9092 \
  --topic my-topic

# Type messages and press Enter
```

### Consuming Messages

```bash
# Start consumer (from beginning)
docker compose exec local-kafka kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic my-topic \
  --from-beginning

# Start consumer (new messages only)
docker compose exec local-kafka kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic my-topic
```

## Using Kafka in Applications

### Python (confluent-kafka)

```python
from confluent_kafka import Producer, Consumer

# Producer
producer = Producer({'bootstrap.servers': 'localhost:9092'})
producer.produce('my-topic', key='key', value='message')
producer.flush()

# Consumer
consumer = Consumer({
    'bootstrap.servers': 'localhost:9092',
    'group.id': 'my-group',
    'auto.offset.reset': 'earliest'
})
consumer.subscribe(['my-topic'])
msg = consumer.poll(1.0)
```

### Node.js (kafkajs)

```javascript
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  brokers: ['localhost:9092']
});

// Producer
const producer = kafka.producer();
await producer.connect();
await producer.send({
  topic: 'my-topic',
  messages: [{ key: 'key', value: 'message' }]
});

// Consumer
const consumer = kafka.consumer({ groupId: 'my-group' });
await consumer.subscribe({ topic: 'my-topic' });
await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log(message.value.toString());
  }
});
```

## Kafka Topics Best Practices

- **Partitions** — Use multiple partitions for parallelism (3-6 for local dev)
- **Replication** — Replication factor 1 is fine for local development
- **Retention** — Configure retention time based on your needs (default: 7 days)
- **Compaction** — Enable compaction for keyed topics if needed

## Resource Usage

Kafka requires:
- **CPU:** Moderate (increases with throughput)
- **RAM:** 512MB-1GB minimum
- **Disk:** Varies based on message retention

Monitor via dashboard or:
```bash
docker stats local-kafka local-zookeeper
```

## Configuration

Kafka runs with default settings optimized for local development:
- **Broker ID:** 1
- **Listeners:** PLAINTEXT://localhost:9092
- **Zookeeper:** local-zookeeper:2181
- **Log retention:** 7 days
- **Segment size:** 1GB

To customize, edit `services/kafka.yml`.

## Health Check

Check if Kafka is running:

```bash
# List topics (should not error)
docker compose exec local-kafka kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --list
```

## Notes

- **Zookeeper required** — Kafka requires Zookeeper (included as `local-zookeeper`)
- **Single broker** — Single Kafka broker is sufficient for local development
- **Data persistence** — Topics and messages persist in Docker volumes
- **Performance** — For production, use Kafka clusters with multiple brokers

## Troubleshooting

### Kafka not accepting connections

```bash
# Check if Kafka and Zookeeper are running
docker compose ps local-kafka local-zookeeper

# Check logs
docker compose logs local-kafka
docker compose logs local-zookeeper
```

### Topics not persisting

Ensure volumes are properly configured in `services/kafka.yml`.

---

**This service is optimized for local development. For production, use a managed Kafka service or multi-broker cluster.**

