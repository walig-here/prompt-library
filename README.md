# 📘 Prompt library

Simple tool that stores LLM prompts for future utilization. Thought to be so simple that even my non-technical mum can use it flawlessly 😋. 

> ⚠️ *CURRENTLY PROJECT IS IN SERIOUS POC STAGE!*

## ⚙️ Functionalities

- **Prompts storage:** User can store their prompts in a form of easily modifiable markdown files. Those prompts can be just literals or prompt templates that contain a bunch of placeholders that may be easily replaced when prompt needs to be used.

- **Prompts retrieval:** Prompts can be retrieved from the storage with a chance to be copied to the user's clipboard.

## 🚀 How to run this (linux)?

1. Create the python virtual environment. Activate it and install tool's dependencies.

    ```bash
    python3 -m venv <VENV_NAME>
    source <VENV_NAME>/bin/activate
    pip install -r requirements.txt
    ```

2. Create `prompts` directory in tool's root and put there markdown files with you prompts/prompt templates.

3. Run `prompt_library` module with *Python*.

    ```bash
    python3 -m prompt_library
    ```
