class GeneralCompose {
    static async Delay(timeout = 1000) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, timeout)
        })
    }

    static async ShutDown() {
        pvi.runInstructionS("RESET", [])
        return
    }

    static async DetectDiode(input, relayBuffer) {
        DAQRelay.TurnOn(relayBuffer)

        await this.Delay(300)

        if (pvi.daq.in[input].value) {
            return true
        } else {
            return false
        }
    }

    static async ShortCircuitCheck(input) {
        pvi.daq.alimenta12()

        await this.Delay(300)

        if (pvi.daq.in[input].value) {
            return true
        } else {
            return false
        }
    }

    static async ReverseDiodeCheck(input) {
        pvi.daq.desligaAlimentacao()
        await this.Delay(300)

        pvi.daq.alimenta110()
        await this.Delay(300)

        if (pvi.daq.in[input].value) {
            return false
        } else {
            return true
        }
    }

    static async IntegrityIGBT(input) {
        if (pvi.daq.in[input].value) {
            return false
        } else {
            return true
        }
    }

    static async Discharge(input, timeOut = 15000) {
        this.ShutDown()

        return new Promise((resolve) => {
            pvi.daq.in[input].onChange = (state) => {
                if (!state) {
                    clearTimeout(timeOutMonitor)
                    pvi.daq.in[input].onChange = () => { }
                    resolve({ success: true, msg: "" })
                } else {
                    resolve({ success: false, msg: "" })
                }
            }
            const timeOutMonitor = setTimeout(() => {
                resolve({ success: false, msg: "" })
            }, timeOut)
        })
    }
}