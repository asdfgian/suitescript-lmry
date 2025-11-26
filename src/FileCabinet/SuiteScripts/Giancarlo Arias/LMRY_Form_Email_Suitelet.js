/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define([
    "N/log",
    "N/ui/serverWidget",
    "N/url",
    "N/runtime",
    "N/search",
    "N/email",
],
    /**
     * URL= https://tstdrv1749318.app.netsuite.com/app/site/hosting/scriptlet.nl?script=5904&deploy=1
     */
    (log, serverWidget, url, runtime, search, email) => {
        class Email {
            constructor(body, emails, attachment, subject) {
                this.body = body;
                this.emails = emails;
                this.subject = subject;
                this.attachment = attachment || null;
            }

            send() {
                this.emails.forEach((recipient) => {
                    const options = {
                        author: 72589,
                        body: this.body,
                        recipients: recipient,
                        subject: this.subject,
                    };

                    if (this.attachment) {
                        options.attachments = [this.attachment];
                    }

                    email.send(options);
                });
            }
        }

        const onRequest = (scriptContext) => {
            const { request, response } = scriptContext;

            if (request.method === "GET") {
                const form = serverWidget.createForm({
                    title: "Envío de correos",
                    hideNavBar: false,
                });

                form.addFieldGroup({
                    id: "custpage_form",
                    label: "Formulario",
                });

                //SELECT -- Department
                form.addField({
                    id: "custpage_department",
                    type: serverWidget.FieldType.SELECT,
                    label: "Deparment",
                    source: "department",
                    container: "custpage_form",
                });
                //SELECT -- Employees
                form.addField({
                    id: "custpage_select_employee",
                    type: serverWidget.FieldType.SELECT,
                    label: "Employee",
                    container: "custpage_form",
                });
                //RICHTEXT -- Text
                form.addField({
                    id: "custpage_rich_text",
                    type: serverWidget.FieldType.RICHTEXT,
                    label: "Body",
                    container: "custpage_form",
                });
                //INPUTFILE
                form.addField({
                    id: "custpage_input",
                    type: serverWidget.FieldType.FILE,
                    label: "File",
                });
                //SUBLIST -- Email
                const sublist = form.addSublist({
                    id: "custpage_sublist",
                    type: serverWidget.SublistType.EDITOR,
                    label: "Table",
                });
                sublist.addField({
                    id: "custpage_col_email",
                    type: serverWidget.FieldType.EMAIL,
                    label: "Email",
                });

                // URL -- string
                const suiteletUrl = url.resolveScript({
                    scriptId: runtime.getCurrentScript().id,
                    deploymentId: runtime.getCurrentScript().deploymentId,
                });

                form.addField({
                    id: "custpage_suitelet_url",
                    type: serverWidget.FieldType.TEXT,
                    label: "URL",
                }).updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN,
                }).defaultValue = suiteletUrl; // beforeLoad user events, The default value for the field.

                form.clientScriptModulePath = "./LMRY_Form_Email_Client.js";

                //BUTTON
                form.addSubmitButton({ label: "Submit" });
                form.addResetButton({ label: "Clean" });

                response.writePage({ pageObject: form });
            }

            if (request.method === "POST") {
                const action = request.parameters.action || "";

                if (action === "filterEmployees") {
                    const departmentId = request.parameters.department || "";
                    const employeeSearch = search.create({
                        type: "employee",
                        filters: departmentId ? [["department", "anyof", departmentId]] : [],
                        columns: ["internalid", "entityid", "email"],
                    });

                    const results = [];
                    employeeSearch.run().each((result) => {
                        results.push({
                            id: result.getValue("internalid"),
                            name: result.getValue("entityid"),
                            email: result.getValue("email"),
                        });
                        return true;
                    });
                    response.write(JSON.stringify(results));
                    return;
                }

                log.debug({
                    title: "Objeto POST (Params)",
                    details: request.parameters,
                });
                const {
                    custpage_department,
                    custpage_select_employee,
                    custpage_rich_text,
                    custpage_sublistdata,
                } = request.parameters;

                const fileUploaded = request.files.custpage_input || null;

                const emails = custpage_sublistdata.split("\u0002"); //array

                let employeeName = '';

                if (custpage_select_employee) {
                    const empData = search.lookupFields({
                        type: search.Type.EMPLOYEE,
                        id: custpage_select_employee,
                        columns: ['firstname', 'lastname']
                    });

                    employeeName = empData.firstname + ' ' + empData.lastname;
                }

                const emailObj = new Email(
                    custpage_rich_text,
                    emails,
                    fileUploaded,
                    "Hola te habla " + employeeName
                );

                emailObj.send();
                response.write("Correo enviado");
            }
        };

        return { onRequest };
    });
