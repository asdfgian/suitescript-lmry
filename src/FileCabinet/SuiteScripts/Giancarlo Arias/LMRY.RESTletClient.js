/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(
    ['N/file', 'N/log'],
    (file, log) => {
        const FILE_ID = '1122778';

        const readFile = () => {
            const fileObj = file.load({ id: FILE_ID });
            const content = fileObj.getContents(); //type string
            return JSON.parse(content || '[]');
        }

        const writeFile = (data) => {
            const content = JSON.stringify(data, null, 4);
            const fileObj = file.load({ id: FILE_ID });
            file.create({
                name: fileObj.name,
                fileType: file.Type.JSON,
                contents: content,
                folder: fileObj.folder,
                isOnline: fileObj.isOnline
            }).save();
        }

        const get = (requestParams) => {
            const data = readFile();
            if (requestParams && requestParams.id) {
                return JSON.stringify(data.find(d => d.id == requestParams.id) || { message: "No se encontraron registros" });
            }
            return JSON.stringify(data);
        };

        const post = (requestBody) => {
            log.debug({
                title: "Debug",
                details: "any"
            })
            // let data = readFile();
            // const newRecord = {
            //     id: Date.now().toString(),
            //     ...requestBody
            // };
            // data.push(newRecord);
            // writeFile(data);
            return JSON.stringify({ message: 'Registro agregado', record: requestBody });
        };

        const put = (requestBody) => {
            let data = readFile();
            const index = data.findIndex(d => d.id == requestBody.id);
            if (index === -1) return { success: false, message: 'No existe el ID' };

            data[index] = { ...data[index], ...requestBody };
            writeFile(data);
            return { success: true, message: 'Registro actualizado', record: data[index] };
        };

        const doDelete = (requestParams) => {
            let data = readFile();
            const newData = data.filter(d => d.id != requestParams.id);
            if (newData.length === data.length) {
                return { success: false, message: 'ID no encontrado' };
            }
            writeFile(newData);
            return { success: true, message: 'Registro eliminado' };
        };

        return { get, post, put, delete: doDelete };
    });

