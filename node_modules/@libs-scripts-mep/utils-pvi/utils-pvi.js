class UtilsPVI {

    /**
     * Retorna o caminho da pasta do script que está sendo executado, baseado no HTML.
     * @returns string
     */
    static getScriptPath() {
        let pathC = location.pathname.slice(location.pathname.indexOf("C:/"), location.pathname.lastIndexOf("/"))
        let pathI = location.pathname.slice(location.pathname.indexOf("I:/"), location.pathname.lastIndexOf("/"))

        if (pathC.length > 0) {
            return pathC
        } else if (pathI.length > 0) {
            return pathI
        }
    }

    /**
     * Retorna o caminho da pasta do PVI em execucao
     * @returns string
     */
    static getPVIPath() {
        return pvi.runInstructionS("getpvipath", [])
    }

    static openJson(path, callback) {
        fetch(path)
            .then((resposta) => {
                console.log(resposta)
                return resposta.json()
            })
            .then((data) => {
                console.log(data)
                callback(data)
            })
            .catch((retornoReject) => {
                alert(retornoReject)
                return false
            })
    }
}