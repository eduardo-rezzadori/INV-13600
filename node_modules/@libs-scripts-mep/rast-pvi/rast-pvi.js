class RastPVI {

    constructor(eventMap, event, componentsToEval) {
        this.SerialNumber = null

        this.InitInfo = null
        this.EndInfo = null

        this.SendTracking = true

        this.EventMap = eventMap
        this.Event = event

        sessionStorage.getItem("ExecCount") == null ? sessionStorage.setItem("ExecCount", 0) : null

        if (sessionStorage.getItem("TestComponents") == null) {
            const responseObj = this.setTestComponents(componentsToEval)

            if (responseObj.sucess) { sessionStorage.setItem("TestComponents", JSON.stringify(responseObj.response)) }
            else { throw new Error(responseObj.message) }
        }

        this.TestComponents = JSON.parse(sessionStorage.getItem("TestComponents"))
    }

    /**
     * 
     * @param {object} componentsToEval formato esperado = { Base: { message: "", regex: "", }, ... }
     * @returns 
     */
    setTestComponents(componentsToEval) {

        const nameIndex = 0, objIndex = 1
        const responseObj = {}

        for (const component of Object.entries(componentsToEval)) {

            const getResult = evalComponent(component[objIndex].regex, component[objIndex].message)

            if (getResult.sucess) {
                responseObj[component[nameIndex]] = getResult.component
            } else {
                return { sucess: false, response: responseObj, message: `${component[nameIndex]} incompatível com o solicitado` }
            }
        }

        return { sucess: true, response: responseObj, message: `` }

        function evalComponent(regex, message) {
            const input = prompt(message)

            if (input != null) {
                const component = input.match(regex)

                if (component != null) {
                    return { sucess: true, component: component[0].toUpperCase() }
                } else {
                    return { sucess: false, component: null }
                }

            } else {
                return { sucess: false, component: input }
            }
        }
    }

    async startObserver() {
        return new Promise((resolve) => {

            const id = PVI.FWLink.globalDaqMessagesObservers.add((message, param) => {

                if (message.includes(this.SerialNumber)) {
                    const result = param[0]
                    const info = JSON.parse(param[1])

                    if (message.includes("init")) {
                        this.InitInfo = info
                        PVI.FWLink.globalDaqMessagesObservers.remove(id)
                        console.log(`Rastreamento Init ${this.SerialNumber}\n`, result, info)
                        resolve(result)
                    }
                    if (message.includes("end")) {
                        this.EndInfo = info
                        PVI.FWLink.globalDaqMessagesObservers.remove(id)
                        console.log(`Rastreamento End ${this.SerialNumber}\n`, result, info)
                        result ? sessionStorage.setItem("ExecCount", parseInt(sessionStorage.getItem("ExecCount")) + 1) : null
                        resolve(result)
                    }
                }
            }, "rastreamento")
        })
    }

    async setSerialNumber(serialNumber = null) {
        if (serialNumber != null && RastUtil.evalSerialNumber(serialNumber)) {
            if (serialNumber.includes("**")) {
                serialNumber = serialNumber.replace("**", "")
                this.SendTracking = false
            }
            this.SerialNumber = serialNumber
            return
        } else {
            return new Promise(async (resolve) => {
                let number = prompt("Informe o número de serie do produto.")

                if (RastUtil.evalSerialNumber(number)) {
                    if (number.includes("**")) {
                        number = number.replace("**", "")
                        this.SendTracking = false
                    }
                    this.SerialNumber = number
                    resolve()
                } else {
                    alert("O valor informado não é um número de série!")
                    resolve(this.setSerialNumber())
                }
            })
        }
    }

    async init(fluxControl = false, program = "", startTime = "") {
        pvi.runInstructionS("ras.init", ["true", this.SerialNumber, this.EventMap.join(";"), this.Event, program, startTime, fluxControl])
        return await this.startObserver()
    }

    setReport(relatorio) {
        pvi.runInstructionS("ras.setreport", [this.SerialNumber, JSON.stringify(relatorio), true])
    }

    async end(sucess, endTime = "") {
        let informationText = ""
        let splitterCount = 0

        const components = new Map(Object.entries(this.TestComponents))

        components.forEach((value, key) => {
            informationText += `${key}=${value}`
            if (splitterCount < components.size) { informationText += "|" }
            splitterCount++
        })

        if (this.SendTracking) {
            pvi.runInstructionS("ras.end", ["true", this.SerialNumber, sucess, informationText, endTime])
            return await this.startObserver()
        } else {
            alert("O Rastreamento não será finalizado!!")
            return true
        }
    }
}

class RastUtil {

    static ENABLED = "enabled"
    static DISABLED = "disabled"

    static isFirstExec() {
        return sessionStorage.getItem("ExecCount") == null || sessionStorage.getItem("ExecCount") == 0
    }

    static getExecCount() {
        return sessionStorage.getItem("ExecCount") == null ? 0 : parseInt(sessionStorage.getItem("ExecCount"))
    }

    static setValidations(user, station, map, script) {
        PVI.runInstructionS("rastreamento.setvalidations", [user, station, map, script])
    }

    static async setOperador() {
        return new Promise((resolve) => {
            if (PVI.runInstructionS("ras.getuser", []) == "") {

                let operador = prompt("Informe o Número do Cracha")

                if (!isNaN(operador) && operador != null) {
                    PVI.runInstructionS("ras.setuser", [operador])
                    resolve()
                } else {
                    alert("O valor informado não é um número!")
                    resolve(this.setOperador())
                }
            } else {
                resolve()
            }
        })
    }

    /**
     * Itera sobre um objeto do tipo RelatorioTeste verificando se ha falhas.
     * @param {RelatorioTeste} report
     * @returns [true] se nao houver falha, [false] se houver.
     */
    static evalReport(report) {
        let sucess = null

        if (report.TesteFuncional.length != 0 || report.TesteComponentes.length != 0) {

            sucess = true

            report.TesteFuncional.forEach((teste) => {
                if (!teste.Resultado) {
                    sucess = false
                }
            })
            report.TesteComponentes.forEach((teste) => {
                if (!teste.Resultado) {
                    sucess = false
                }
            })
        }
        return sucess
    }

    static evalSerialNumber(serialNumber) {
        if (serialNumber != null && serialNumber.match(/[1][0][0][0][0-9]{8}/) != null) {
            return true
        } else {
            return false
        }
    }
}