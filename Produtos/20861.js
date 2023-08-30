class TestScript {
    constructor(eventMap, event) {

        this.EventMap = eventMap
        this.Event = event

        //instancias de modulos
        this.Std = new SmartTestDevice(1, 3, "dc4", "dc3", "dc2", "dc1")
        this.TestReport = new RelatorioTeste()

        this.RelaysState = []

        this.TestComponents = {
            Base: {
                Name: "BS-80",
                Image: "Imagens\\BS-80.png",
            },
            Fixture: {
                Name: "FX-72",
                Image: "Imagens\\padrao.png",
            },
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
                this.Std.MoveUp()
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
            await UI.modalInfo("Imagens/gravador.jpg", "Conecte o gravador à tomada, ao USB e à base, utilizando o isolador, conforme indicado")
        }

        this.Std.EmergencyObserver().then((info) => { console.error(info); alert(info.msg); return true })
        const moveUpInit = await this.Std.MoveUp()
        if (!moveUpInit.result) { this.TestReport.AddTesteFuncional("Sobe Motor [Inicio]", moveUpInit.msg, -1, false); return true }
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
        /*
        chama uma função para detectar a montagem o diodo

        chama uma função para detectar curto na entrada

        chama função para detectar curto no diodo

        chama função para detectar curto no IGBT

        descarga cap

        gravo firmware

        testo o acionamento do motor pelo potenciometro

        mudo a alimentação para testar a tensão máxima na saída (deve ser igual em 110 e em 220Vac)
        
        descarga cap
        */

        const detectDiode = await GeneralCompose.DetectDiode()
        if (detectDiode) {
            // aprovar
        } else {
            // reprovar e finalizar
        }

        const shortCircuitCheck = await GeneralCompose.ShortCircuitCheck()
        if (shortCircuitCheck) {
            // aprovar
        } else {
            // reprovar e finalizar
        }

        const reverseDiodeCheck = await GeneralCompose.ReverseDiodeCheck()
        if (reverseDiodeCheck) {
            // aprovar
        } else {
            // reprovar e finalizar
        }

        const integrityIGBT = await GeneralCompose.IntegrityIGBT()
        if (integrityIGBT) {
            // aprovar
        } else {
            // reprovar e finalizar
        }

        await GeneralCompose.Discharge()

        //#endregion
    }
}