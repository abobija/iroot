# iroot
Server for IoT devices

## Usage

```
npm i -g typescript
npm i
npm start
```

## Message structure

| Name | Type | Mandatory |
| --- | --- | --- |
| `type` | Enum(`subscribe`, `publish`) | **Yes** |
| `channel` | String | **Yes** |
| `topic` | String | Yes if `publish` |
| `data` | String | Yes if `publish` |

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

## Dashboard

Dashboard is located at `/dashboard` path.

## Api Routes

- `GET /api/channels`
- `GET /api/channel/:id`
- `GET /api/channel/:id/subscribers`
- `POST /api/channel/publish`
    
    Publish message to all subscribers on channel. Message need to be passed in request body in a JSON format:
    ```json
    {
        "type": "publish",
        "channel": "/main",
        "topic": "greeting",
        "data": "hello"
    }
    ```
- `GET /api/devices`
- `GET /api/device/:id`