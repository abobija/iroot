# iroot
Server for IoT devices

## Payload structure

| Name | Type | Mandatory |
| --- | --- | --- |
| `action` | Enum(`subscribe`, `publish`) | **Yes** |
| `channel` | String | **Yes** |
| `data` | String | No |

### Example 1

Subscribing to channel

```json
{
    "action": "subscribe",
    "channel": "/home/livingroom/light4"
}
```

### Example 2

Publishing to channel

```json
{
    "action": "publish",
    "channel": "/home/bedroom/light1",
    "data": "ON"
}
```