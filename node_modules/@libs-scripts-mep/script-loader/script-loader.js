class Loader {

    static async Init(eventMap, event) {
        try {
            const UIRes = await UI.init()
            console.log(UIRes)

            UI.setMsg("Coletando informações do sistema\n\nAguarde")
            const ERPData = await this.ERPDataInit()
            console.log("ERP Data:\n", ERPData)

            UI.setMsg("Carregando script de teste\n\nAguarde")
            const loadStatus = await this.LoadScript(`./Produtos/${Effective.getProductCode()}.js`)
            console.log("Load Script Status:\n", loadStatus)

            UI.setMsg("")
            window.TS = new TestScript(eventMap, event)

        } catch (error) {
            console.warn(error.message)
            sessionStorage.clear()
            alert(error.message)
            location.reload()
        }
    }

    static async ERPDataInit() {
        return new Promise((resolve, reject) => {

            if (Effective.ERPDataExists()) {
                Effective.getParsedERPData((data) => {
                    if (data) {
                        Effective.setProductData(data)
                        resolve(data)
                    } else {
                        sessionStorage.clear()
                        reject("Erro ao converter dados ERP de sessionStorage")
                    }
                })
            } else {
                Effective.setERPData((sucess) => {
                    if (sucess) {
                        Effective.getParsedERPData((data) => {
                            if (data) {
                                Effective.setProductData(data)
                                resolve(data)
                            } else {
                                sessionStorage.clear()
                                reject("Erro ao converter dados ERP de sessionStorage")
                            }
                        })
                    } else {
                        reject("Erro ao setar dados ERP em sessionStorage")
                        sessionStorage.clear()
                        location.reload()
                    }
                })
            }
        })
    }

    static LoadScript(FILE_URL, async = true, type = "text/javascript") {
        return new Promise((resolve, reject) => {
            try {
                const scriptElement = document.createElement("script")
                scriptElement.type = type
                scriptElement.async = async
                scriptElement.src = FILE_URL

                scriptElement.addEventListener("load", (ev) => {
                    resolve({
                        status: true,
                        scriptFile: FILE_URL
                    })
                })
                scriptElement.addEventListener("error", (ev) => {
                    reject({
                        status: false,
                        scriptFile: FILE_URL,
                        message: `Failed to load the script ${FILE_URL}`
                    })
                })

                document.body.appendChild(scriptElement)
            } catch (error) {
                reject(error)
            }
        })
    }
}

