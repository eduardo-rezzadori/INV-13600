class TestScript {
    constructor(eventMap, event) {

        this.EventMap = eventMap
        this.Event = event

        //instancias de modulos
        this.Std = new SmartTestDevice(1, 3, "dc4", "dc3", "dc2", "dc1")
        this.TestReport = new RelatorioTeste()

        this.Relays = new Array()

        this.TestComponents = {
            Base: {
                Name: "BS-80",
                Image: "Imagens\\BS-80.png",
                message: "Informe o código de barras da base:",
                regex: "(BS|bs)-80.[1-9](\/|;)(REV|rev)[0-9]",
            },
            Fixture: {
                Name: "FX-72",
                Image: "Imagens\\padrao.png",
                message: "Informe o código de barras do fixture:",
                regex: "(FX|fx)-72.[1-9](\/|;)(REV|rev)[0-9]",
            },
        }

        this.WriteFirmwareOptions = {
            Device: "STM8S003F3"
        }

        //roteiro de teste
        this.Run()
            .then(async (noTracking) => {
                this.Std.MoveUp()
                this.Controller.Processing = false
                this.VoltageReader.Processing = false
                await SerialPVIUtil.closeAllPorts()
                GeneralCompose.ShutDown()
                console.timeEnd("Run")

                if (noTracking) {
                    UI.displayReport(this.TestReport)
                } else {
                    await UI.setMsg("Finalizando rastreamento...")
                    RelatorioTeste.OrdenaRelatorio(this.TestReport)
                    this.Rast.setReport(this.TestReport)
                    const rastEndSucess = await this.Rast.end(RastUtil.evalReport(this.TestReport))
                    if (!rastEndSucess) { this.TestReport.AddTesteFuncional("Rastreamento End", this.Rast.EndInfo.Message, -1, false); throw new Error("Impossível finalizar o rastreamento") }
                    UI.displayReport(this.TestReport)
                }
            })
            .catch(async (error) => {
                GeneralCompose.ShutDown()

                // this.Std.MoveUp()
                console.timeEnd("Run")
                this.TestReport.AddTesteFuncional("Exception", error, -1, false)
                UI.displayReport(this.TestReport)
            })
    }

    async Run() {
        console.time("Run")

        //#region Infra Setup
        if (RastUtil.isFirstExec()) {
            await UI.modalInfo(this.TestComponents.Base.Image, `Utlize a base ${this.TestComponents.Base.Name}`)
            await UI.modalInfo(this.TestComponents.Fixture.Image, `Utlize o fixture ${this.TestComponents.Fixture.Name}`)
            await UI.modalInfo("Imagens/setupTrafoUSB.jpeg", "Conecte o trafo e o USB na base conforme indicado")
            // await UI.modalInfo("Imagens/gravador.jpg", "Conecte o gravador à tomada, ao USB e à base, utilizando o isolador, conforme indicado")
        }

        this.Std.EmergencyObserver().then((info) => { console.error(info); alert(info.msg); return true })
        // const moveUpInit = await this.Std.MoveUp()
        // if (!moveUpInit.result) { this.TestReport.AddTesteFuncional("Sobe Motor [Inicio]", moveUpInit.msg, -1, false); return true }
        //#region Infra Setup

        //#region Rast
        await UI.setMsg("Iniciando rastreamento...")
        RastUtil.setValidations(RastUtil.ENABLED, RastUtil.ENABLED, RastUtil.ENABLED, RastUtil.DISABLED)
        this.Rast = new RastPVI(this.EventMap, this.Event, this.TestComponents) //BS-80.2/REV2   FX-72.1/REV0
        await RastUtil.setOperador()
        await this.Rast.setSerialNumber() //1000008256844

        const rastInitSucess = await this.Rast.init()
        if (!rastInitSucess) { this.TestReport.AddTesteFuncional("Rastreamento Init", this.Rast.InitInfo.Message, -1, false); return }
        UI.setTitle(this.Rast.InitInfo.item.OpInfo.Product.Name)
        const finalFirmwarePath = this.Rast.InitInfo.item.OpInfo.OpProcesses.find(process => process.ID == "TF").Firmware
        //#endregion Rast

        //#region Start
        await UI.setMsg("Posicione o controlador na jiga e pressione o bimanual.")
        const moveDown = await this.Std.MoveDown(15000, false)
        if (!moveDown.result) { this.TestReport.AddTesteFuncional("Desce Motor", "Falha ao atuar na descida do motor", -1, false); return true }

        await UI.setMsg("Verificando a montagem do diodo...")
        DAQRelay.AddRelay(2, this.Relays)
        DAQRelay.AddRelay(8, this.Relays)
        const detectDiode = await GeneralCompose.DetectDiode("ac1", this.Relays)
        if (detectDiode) {
            // aprovar
        } else {
            // reprovar e finalizar
            throw "diodo não montado"
        }
        DAQRelay.RemoveRelay(2, this.Relays)
        DAQRelay.RemoveRelay(8, this.Relays)
        DAQRelay.TurnOn(this.Relays)

        await UI.setMsg("Verificando a integridade da fonte de alimentação...")
        const shortCircuitCheck = await GeneralCompose.ShortCircuitCheck("ac1")
        if (shortCircuitCheck) {
            // aprovar
        } else {
            // reprovar e finalizar
            throw "curto na fonte"
        }

        await UI.setMsg("Verificando a polaridade do diodo...")
        const reverseDiodeCheck = await GeneralCompose.ReverseDiodeCheck("ac2")
        if (reverseDiodeCheck) {
            // aprovar
        } else {
            // reprovar e finalizar
            throw "diodo virado"
        }

        await UI.setMsg("Verificando curto-circuito no IGBT...")
        const integrityIGBT = await GeneralCompose.IntegrityIGBT("ac3")
        if (integrityIGBT) {
            // aprovar
        } else {
            // reprovar e finalizar
            throw "curto no igbt"
        }

        await UI.setMsg("Descaregando o capacitor...")
        DAQRelay.AddRelay(18, this.Relays)
        await GeneralCompose.Discharge("ac1", this.Relays)
        DAQRelay.RemoveRelay(18, this.Relays)
        DAQRelay.TurnOn(this.Relays)

        // const protect = (finalFirmwarePath.substring(0, finalFirmwarePath.lastIndexOf("\\"))) + "/protect.hex"
        // // let OptionBytesDespr = "I:/Documentos/Softwares/STM8/despr_it.hex"

        // const resultWriteFirmware = await GravaFW.STM8(finalFirmwarePath, protect, this.WriteFirmwareOptions)
        // if (resultWriteFirmware.success) {
        //     console.log('sucesso');
        // } else {
        //     console.log('falha');
        //     throw "nao gravou"
        // }

        await UI.setMsg("Posicione o potenciômetro no mínimo, conforme a imagem, e pressione avança!")
        await UI.setImage("Imagens\\pot-min.png")
        const advance = await UI.advance()
        if (!advance) {
            // reprovar e finalizar
        }

        await UI.setMsg("Energizando o controlador!")
        const powerUp = await GeneralCompose.PowerUp()
        if (!powerUp) {
            // reprovar e finalizar
        }

        await UI.setMsg("O LED acionou?")
        const yesOrNo = await UI.yesNo()
        if (!yesOrNo) {
            // reprovar e finalizar
        }

        await UI.setMsg("Posicione o potenciômetro no centro, conforme a imagem")
        await UI.setImage("Imagens\\pot-centro.png")
        DAQRelay.AddRelay(16, this.Relays)
        DAQRelay.TurnOn(this.Relays)
        // let dutyCicleCheck = await GeneralCompose.DutyCicleCheck()
        let voltageCheck = await GeneralCompose.VoltageCheck("voltageOrCurrent3", 1.7, 0.3)
        if (voltageCheck) {
            // aprovar
        } else {
            // reprovar e finalizar
        }

        await UI.setMsg("Posicione o potenciômetro no máximo")
        await UI.setImage("Imagens\\padrao.png")
        voltageCheck = await GeneralCompose.VoltageCheck("voltageOrCurrent3", 2.3, 0.3)
        // dutyCicleCheck = await GeneralCompose.DutyCicleCheck() // verificar se consigo ler duty aqui
        // penso em fazer uma redundancia pela tensão média
        if (voltageCheck) {
            // aprovar
        } else {
            // reprovar e finalizar
        }

        await UI.setMsg("Descaregando o capacitor...")
        DAQRelay.AddRelay(18, this.Relays)
        const promise1 = GeneralCompose.Discharge("ac1", this.Relays)

        await UI.setMsg("Posicione o potenciometro no mínimo novamente e pressione avanca")
        const promise2 = UI.advance()

        const promises = await Promise.all([promise1, promise2])

        throw "só remover isso"
        //#endregion
    }
}