# Developer's manual

## The development environment

Application should be developed locally on the Linux/WSL and inside containerized *Docker* environment in order to grant unified development experience and cut-on setup time when moving to different devices or involving new developers. The environment is based on the *prompt-library* image defined in the project's [`Dockerfile`](/Dockerfile).

- [Developer's manual](#developers-manual)
  - [The development environment](#the-development-environment)
    - [Running dev server (Linux/WSL)](#running-dev-server-linuxwsl)
    - [Architecture](#architecture)
    - [Security considerations](#security-considerations)

### Running dev server (Linux/WSL)

1. Run the [`run-container.sh`](/run-container.sh) script in order to built *prompt-library* image and run container that uses it. 

    ```bash
    ./run-container.sh
    ```

    If you already have *prompt-library* image built in your system and there's no recent changes to the image then run this script with `--run` flag in order to just run container.

    ```bash
    ./run-container.sh --run
    ```

2. Previous step would put you inside terminal of the development container. Use the [`run-dev-server.sh`](/scripts/run-dev-server.sh) script from the `scripts` directory. It would invoke all needed services and open the development server on *http://localhost:6800/vnc.html*.

    ```bash
    ./scripts/run-dev-server.sh
    ```

3. Open the *http://localhost:6800/vnc.html* and click the *Connect* button on the middle of the screen in order to access development version of the app. 

    ![dev server landing page](/docs/img/dev-server-landing.png)

### Architecture

The *VNC*-based (*Virtual Network Computing*) architecture has been applied for the dev environment in order to allow for accessing UI of the application running in the container (which's headless by default). In the shortcut it streams container's virtual frame buffer with the use of VNC that are then translated into the web packets, allowing developers to view UI in their browsers without installing any additional VNC clients.

![](/docs/img/dev-server-architecture.drawio.svg)

### Security considerations

Utilized VNC protocol is not considered to be secure when no additional SSH tunneling is applied for it. Those security measures have not been applied there since all VNC-based communication is meant to be performed in a scope of the single device and never reach outside of it. 
