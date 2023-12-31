class GeneralCompose {

    /**
     * É só um delay que segura a execução
     * @param {int} timeout 
     * @returns 
     */
    static async Delay(timeout = 1000) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, timeout)
        })
    }

    /**
     * Reset do DAQ
     * @returns 
     */
    static async ShutDown() {
        pvi.runInstructionS("RESET", [])
        return
    }

    /**
     * Detecção da montagem do diodo free wheel
     * @param {string} input entrada do DAQ responsável pela leitura
     * @param {Array} relayBuffer buffer de relés
     * @param {int} delay estabilização do daq
     * @returns boolean
     */
    static async DetectDiode(input, relayBuffer, delay = 1000) {
        DAQRelay.TurnOn(relayBuffer)

        await this.Delay(delay)

        if (pvi.daq.in[input].value) {
            return true
        } else {
            return false
        }
    }

    /**
     * Detecta curto na fonte de alimentação
     * @param {string} input entrada do DAQ responsável pela leitura
     * @returns boolean
     */
    static async ShortCircuitCheck(input) {
        pvi.daq.alimenta12()

        await this.Delay(1000)

        if (pvi.daq.in[input].value) {
            return true
        } else {
            return false
        }
    }

    /**
     * Retorna false caso o acione a entrada acoplada ao terminal MOTOR(-)
     * @param {string} input entrada do DAQ responsável pela leitura
     * @returns boolean
     */
    static async ReverseDiodeCheck(input) {
        pvi.daq.desligaAlimentacao()
        await this.Delay(300)

        pvi.daq.alimenta110()
        await this.Delay(1000)

        if (pvi.daq.in[input].value) {
            return false
        } else {
            return true
        }
    }

    /**
     * Detecção de curto no IGBT
     * @param {string} input entrada do DAQ responsável pela leitura
     * @returns boolean
     */
    static async IntegrityIGBT(input) {
        this.Delay(300)
        if (pvi.daq.in[input].value) {
            return false
        } else {
            return true
        }
    }

    /**
     * 
     * @param {string} input entrada do DAQ responsável pela leitura
     * @param {int} timeOut 
     * @returns object
     */
    static async Discharge(input, relays, timeOut = 15000) {
        this.ShutDown()
        DAQRelay.TurnOn(relays)

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
                pvi.daq.in[input].onChange = () => { }
                resolve({ success: false, msg: "" })
            }, timeOut)
        })
    }

    /**
     * Alimenta o controlador
     * @param {string} tensao "110" ou "220"
     * @param {string} input entrada do DAQ responsável pela leitura 
     * @returns boolean
     */
    static async PowerUp(tensao = "110", input = "ac1") {
        if (tensao == "110") {
            pvi.daq.alimenta110()
        } else if (tensao == "220") {
            pvi.daq.alimenta220()
        }

        await this.Delay(1000)

        if (pvi.daq.in[input].value) {
            return true
        } else {
            return false
        }
    }

    /**
     * Medição de duty-cicle na saída do motor
     * @param {string} input entrada do DAQ responsável pela leitura
     * @param {int} target valor de duty esperado
     * @param {int} tolerancia na medição de duty
     * @param {int} timeOut 
     * @returns object
     */
    static async DutyCicleCheck(input, target, tolerancia, timeOut = 15000) {
        return new Promise((resolve) => {
            pvi.daq.in[input].onChange = (duty) => {
                if (duty >= target - tolerancia && duty <= target + tolerancia) {
                    clearTimeout(timeOutMonitor)
                    pvi.daq.in[input].onChange = () => { }
                    resolve({ success: true, duty: duty })
                }
            }
            const timeOutMonitor = setTimeout(() => {
                pvi.daq.in[input].onChange = () => { }
                resolve({ success: false })
            }, timeOut)
        })
    }
    /**
     * 
     * @param {string} input entrada do DAQ responsável pela leitura
     * @param {float} target valor de tensão esperado no conversor
     * @param {float} tolerance tolerancia na leitura 
     * @param {int} timeout 
     * @returns object
     */
    static async VoltageCheck(input, target, tolerance, timeout = 60000) {
        return new Promise((resolve) => {
            pvi.daq.in[input].value.onChange = (voltage) => {
                if ((target - tolerance) < voltage && voltage < (target + tolerance)) {
                    clearTimeout(timeOutMonitor)
                    pvi.daq.in[input].value.onChange = () => { }
                    resolve({ success: true, value: voltage, msg: "" })
                }
            }
            const timeOutMonitor = setTimeout(() => {
                console.error("f")
                pvi.daq.in[input].value.onChange = () => { }
                resolve({ success: false, value: pvi.daq.in[input].value.value, msg: "" })
            }, timeout)
        })
    }

}