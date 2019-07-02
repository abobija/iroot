# iroot
Server for IoT devices

## Usage

```
npm i
npm start
```

## Devices / Clients

- [ESP32](https://github.com/abobija/iroot-dev)

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

## DB Files Examples

:point_right: Database folder `/db` and all files will be auto-generated at application startup.

- _`channels.json`_
    ```json
    [
        {
            "path": "/home/room/led"
        },
        {
            "path": "/gsm"
        }
    ]
    ```

- _`credentials.json`_
    ```json
    [
        {
            "uid": "dev32",
            "pwd": "test1234"
        },
        {
            "uid": "dev32-led",
            "pwd": "test1234"
        }
    ]
    ```