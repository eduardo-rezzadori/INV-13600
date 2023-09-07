class UI {

    static async init() {
        this.onRestartClick()
        return await this.hideAll()
    }

    static reload() {
        pvi.runInstructionS("RESET", [])
        location.reload()
    }

    static async setImage(imagem) {
        html_imgTest.src = imagem
        html_imgTest.style.display = "initial"
        return await this.waitToRender()
    }

    static async closeImage() {
        html_imgTest.style.display = "none"
        return await this.waitToRender()
    }

    static async setMsg(msg) {
        html_testMsg.innerText = msg
        return await this.waitToRender()
    }

    static async setTitle(msg) {
        html_testTitle.innerText = msg
        return await this.waitToRender()
    }

    static async hideAll() {
        html_btnAvanca.style.visibility = "hidden"
        html_btnAux1.style.visibility = "hidden"
        html_btnAux2.style.visibility = "hidden"
        html_btnAux3.style.visibility = "hidden"
        html_btnNao.style.visibility = "hidden"
        html_btnSim.style.visibility = "hidden"
        html_imgTest.style.display = "none"
        html_modal.style.display = "none"
        return await this.waitToRender()
    }

    static async onKeyDown(key, toReturnValue) {
        return new Promise((resolve) => {
            document.addEventListener('keydown', (event) => {
                if (event.key == key) {
                    resolve(toReturnValue)
                }
            })
        })
    }

    static async onClick(element, toReturnValue) {
        return new Promise((resolve) => {
            element.addEventListener('click', () => {
                resolve(toReturnValue)
            }, { once: true })
        })
    }

    static async onRestartClick() {
        const onClick = await this.onClick(html_btnRestart, () => { this.reload() })
        onClick()
    }

    static async interactionTimeout(timeout, toReturnValue) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(toReturnValue)
            }, timeout)
        })
    }

    static async waitToRender(delay = 10) {
        return new Promise((resolver) => {
            setTimeout(() => {
                resolver()
            }, delay)
        })
    }

    static async modalInfo(image, message) {
        return new Promise(async (resolve) => {

            html_txtModal.disabled = true
            html_modalImg.src = image
            html_txtModal.value = message
            html_txtModal.style.minHeight = "100px"
            html_modal.style.display = ""
            await this.waitToRender()

            await this.onClick(html_btnOkModal)

            html_modal.style.display = "none"
            await this.waitToRender()
            resolve()
        })
    }

    static async yesNo(timeout = 15000) {

        html_btnSim.style.visibility = "visible"
        html_btnNao.style.visibility = "visible"

        await this.waitToRender()

        const timeOut = this.interactionTimeout(timeout, null)

        const Up = this.onKeyDown("ArrowUp", true)
        const KeyS = this.onKeyDown("s", true)
        const Down = this.onKeyDown("ArrowDown", false)
        const KeyN = this.onKeyDown("n", false)
        const ClickS = this.onClick(html_btnSim, true)
        const ClickN = this.onClick(html_btnNao, false)

        const choice = await Promise.race([Up, Down, KeyS, KeyN, ClickS, ClickN, timeOut])

        html_btnSim.style.visibility = "hidden"
        html_btnNao.style.visibility = "hidden"

        await this.waitToRender()

        return choice
    }

    static async advance(timeout = 15000) {

        html_btnAvanca.style.visibility = "visible"
        await this.waitToRender()

        const timeOut = this.interactionTimeout(timeout, false)
        const Click = this.onClick(html_btnAvanca, true)
        const Right = this.onKeyDown("ArrowRight", true)

        const interacted = await Promise.race([Click, Right, timeOut])

        html_btnAvanca.style.visibility = "hidden"
        await this.waitToRender()

        return interacted
    }

    static async displayReport(report) {

        let falhas = new Map()

        if (report.TesteFuncional.length != 0 || report.TesteComponentes.length != 0) {

            report.TesteFuncional.forEach((teste) => {
                if (!teste.Resultado) {
                    falhas.set(teste.Nome, teste.Descricao)
                }
            })

            report.TesteComponentes.forEach((teste) => {
                if (!teste.Resultado) {
                    falhas.set(teste.Designator, `Esperava: ${teste.Referencia} +- ${teste.Aceitacao}, Obteve: ${teste.Valor}`)
                }
            })
        }

        if (falhas.size == 0) {
            await this.displayPass()
            await this.interactionTimeout(3000)
            this.reload()

        } else {
            let texto = ""

            falhas.forEach((valor, chave) => {
                texto += chave + " -> " + valor + "\n"
            })
            html_txtModal.value = "Falha nos testes:\n" + texto

            await this.displayFail()
            await this.onClick(html_btnOkModal)
            this.reload()
        }
    }

    static async displayPass() {
        html_txtModal.disabled = true
        html_modalTitle.style.fontSize = "30px"
        html_modal.style.display = ""
        html_modalTitle.innerText = "Aprovado"
        html_modalTitle.style.color = "green"
        html_modalImg.src = "Imagens/OK.png"
        html_txtModal.style.display = "none"
        await this.waitToRender()
    }

    static async displayFail() {
        html_txtModal.disabled = true
        html_modalTitle.style.fontSize = "30px"
        html_modal.style.display = ""
        html_modalTitle.innerText = "Reprovado"
        html_modalTitle.style.color = "red"
        html_modalImg.src = "Imagens/NOK.png"
        html_txtModal.style.display = ""
        await this.waitToRender()
    }
}