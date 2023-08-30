class SmartTestDevice {
    /**
     * 
     * @param {Array} UpRelay array contendo o rele responsavel por fazer a base subir o motor
     * @param {Array} DownRelay array contendo o rele responsavel por fazer a base descer o motor
     * @param {string} TopLimitSwitch string informando a entrada relacionada ao fim de curso superior
     * @param {string} BottomLimitSwitch string informando a entrada relacionada ao fim de curso inferior
     * @param {string} Bimanual string informando a entrada relacionada ao Bimanual
     * @param {string} Emergency string informando a entrada relacionada a Emergency
     */
    constructor(upRelay, downRelay, topLimitSwitch, bottomLimitSwitch, bimanual, emergency) {
        this.BottomLimitSwitch = bottomLimitSwitch
        this.TopLimitSwitch = topLimitSwitch
        this.Emergency = emergency
        this.DownRelay = downRelay
        this.UpRelay = upRelay
        this.Bimanual = bimanual
        this.EmergencyTriggered = false
    }

    static MOVING_TIMEOUT = "Motor demorou para chegar ao destino"
    static MOVING_SUCESS = "Motor atuou como esperado"
    static MOVING_INTERRUPT = "Movimentação do motor interrompida!"

    static BIMANUAL_TIMEOUT = "Bimanual não detectado dentro do tempo esperado"
    static BIMANUAL_TRIGGERED = "Entrada bimanual detectada"
    static BIMANUAL_ALWAYS_TRIGGERED = "Entrada bimanual sempre acionada"

    static EMERGENCY_TRIGGERED = "Emergência acionada!"
    static EMERGENCY_ALWAYS_TRIGGERED = "Emergência sempre acionada!"

    async MoveDown(timeOut = 5000, expectedLevel = false) {

        return new Promise((resolve) => {

            let awaitsMoving = setInterval(() => {
                if (this.EmergencyTriggered) {

                    clearInterval(awaitsMoving)
                    clearTimeout(movingTimeOut)
                    pvi.daq.desligaRele(this.UpRelay)
                    resolve({ result: false, msg: SmartTestDevice.MOVING_INTERRUPT })

                } else if (pvi.daq.in[this.BottomLimitSwitch].value == expectedLevel) {
                    clearInterval(awaitsMoving)
                    clearTimeout(movingTimeOut)
                    pvi.daq.desligaRele(this.DownRelay)
                    resolve({ result: true, msg: SmartTestDevice.MOVING_SUCESS })

                } else {
                    if (pvi.daq.in[this.Bimanual].value == true) {
                        pvi.daq.ligaRele(this.DownRelay)
                    } else {
                        pvi.daq.desligaRele(this.DownRelay)
                    }
                }
            }, 100)

            let movingTimeOut = setTimeout(() => {
                clearInterval(awaitsMoving)
                pvi.daq.desligaRele(this.DownRelay)
                resolve({ result: false, msg: SmartTestDevice.MOVING_TIMEOUT })
            }, timeOut)
        })

    }

    async MoveUp(timeOut = 5000, expectedLevel = false) {

        return new Promise((resolve) => {
            let awaitsMoving = setInterval(() => {
                if (this.EmergencyTriggered) {

                    clearInterval(awaitsMoving)
                    clearTimeout(movingTimeOut)
                    pvi.daq.desligaRele(this.UpRelay)
                    resolve({ result: false, msg: SmartTestDevice.MOVING_INTERRUPT })

                } else if (pvi.daq.in[this.TopLimitSwitch].value == expectedLevel) {

                    clearInterval(awaitsMoving)
                    clearTimeout(movingTimeOut)

                    pvi.daq.desligaRele(this.UpRelay)
                    resolve({ result: true, msg: SmartTestDevice.MOVING_SUCESS })
                } else {
                    pvi.daq.ligaRele(this.UpRelay)
                }
            }, 100)

            let movingTimeOut = setTimeout(() => {
                clearInterval(awaitsMoving)
                pvi.daq.desligaRele(this.UpRelay)
                resolve({ result: false, msg: SmartTestDevice.MOVING_TIMEOUT })
            }, timeOut)
        })
    }

    async BimanualObserver(input = this.Bimanual, timeout = 15000, expectedLevel = true) {
        return new Promise((resolve) => {
            if (pvi.daq.in[input].value == !expectedLevel) {

                pvi.daq.in[input].onChange = (logicLevel) => {
                    if (logicLevel == expectedLevel) {
                        clearTimeout(timeOutMonitor)
                        resolve({ result: true, msg: SmartTestDevice.BIMANUAL_TRIGGERED })
                    }
                }
            } else {
                resolve({ result: false, msg: SmartTestDevice.BIMANUAL_ALWAYS_TRIGGERED })
            }

            const timeOutMonitor = setTimeout(() => {
                pvi.daq.in[input].onChange = () => { }
                resolve({ result: false, msg: SmartTestDevice.BIMANUAL_TIMEOUT })
            }, timeout)
        })
    }

    async EmergencyObserver(input = this.Emergency) {
        return new Promise((resolve) => {
            if (pvi.daq.in[input].value == true) {
                pvi.daq.in[input].onChange = (logicLevel) => {
                    if (logicLevel == false) {
                        this.EmergencyTriggered = true
                        resolve({ triggered: true, msg: SmartTestDevice.EMERGENCY_TRIGGERED })
                    }
                }
            } else {
                resolve({ triggered: false, msg: SmartTestDevice.EMERGENCY_ALWAYS_TRIGGERED })
            }
        })
    }
}