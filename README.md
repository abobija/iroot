# iroot
Server for IoT devices

## Message structure

| Name | Type | Mandatory |
| --- | --- | --- |
| `type` | Enum(`subscribe`, `publish`) | **Yes** |
| `channel` | String | **Yes** |
| `topic` | String | Yes if `publish` |
| `data` | String | No |

### Example 1

Subscribing to channel

```json
{
    "type": "subscribe",
    "channel": "/home/livingroom/light4"
}
```

### Example 2

Publishing to channel

```json
{
    "type": "publish",
    "channel": "/home/bedroom/light1",
    "topic": "state",
    "data": "on"
}
```

## Api

### Routes

- `GET /api/channels`
- `GET /api/channel/:id`
- `GET /api/channel/:id/subscribers`
- `GET /api/devices`
- `GET /api/device/:id`