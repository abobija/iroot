# Linux environment

## Run app as service

Save file `iroot.service` into folder `/etc/systemd/system`

:grey_exclamation: _Edit `iroot.service` file first if absolute path of app is not `/usr/iroot`_

## Service control cmds

Enable service

```shell
sudo systemctl enable iroot.service
```

Start service

```shell
sudo systemctl start iroot.service
```

Check status of service

```shell
sudo systemctl status iroot.service
```

Stop service

```shell
sudo systemctl stop iroot.service
```

Disable service

```shell
sudo systemctl disable iroot.service
```