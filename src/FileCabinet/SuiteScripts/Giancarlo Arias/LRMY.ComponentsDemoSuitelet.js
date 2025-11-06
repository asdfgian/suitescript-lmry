/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 *
 */
define(
    ["N/ui/serverWidget", "N/search"],
    (serverWidget, search) => {

        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };

        const getEmployees = () => {
            let employees = [];
            const employeeSearch = search.create({
                type: search.Type.EMPLOYEE,
                columns: [
                    "entityid",
                    "firstname",
                    "email",
                    search.createColumn({
                        name: "name",
                        join: "subsidiary",
                    }),
                    "title",
                ],
            });

            const results = employeeSearch.run().getRange({ start: 10, end: 50 });

            results.forEach((result) => {
                employees.push({
                    id: result.getValue("entityid"),
                    name: result.getValue("firstname"),
                    email: result.getValue("email"),
                    subsidiary: result.getValue({ name: "name", join: "subsidiary" }),
                    title: result.getValue("title"),
                });
            });

            employees = shuffleArray(employees);

            return employees.filter((employee) => {
                return Object.values(employee).every(
                    (value) => value && value.toString().trim() !== ""
                );
            });
        };

        const onRequest = (context) => {
            const { request, response } = context;

            const form = serverWidget.createForm({
                title: "Employees",
                hideNavBar: true,
            });

            // SUBTABS
            const tabMain = form.addTab({
                id: "custpage_tab_main",
                label: "Main",
            });

            const tabAdvanced = form.addTab({
                id: "custpage_tab_adv",
                label: "Advanced",
            });

            // FIELD GROUPS
            // form.addFieldGroup({
            //     id: "custpage_fg_basic",
            //     label: "Basic fields",
            //     tab: "custpage_tab_main",
            // });

            form.addFieldGroup({
                id: "custpage_fg_misc",
                label: "Misc / Advanced",
                tab: "custpage_tab_adv",
            });

            // (HEADER / Main tab)
            // form
            //     .addField({
            //         id: "custpage_txt_name",
            //         type: serverWidget.FieldType.TEXT,
            //         label: "Text (Name)",
            //         container: "custpage_fg_basic",
            //         tab: "custpage_tab_main",
            //     })
            //     .updateBreakType({ breakType: serverWidget.FieldBreakType.STARTROW });

            // form.addField({
            //     id: "custpage_txt_email",
            //     type: serverWidget.FieldType.EMAIL,
            //     label: "Email",
            //     container: "custpage_fg_basic",
            //     tab: "custpage_tab_main",
            // });

            // form.addField({
            //     id: "custpage_phone",
            //     type: serverWidget.FieldType.PHONE,
            //     label: "Phone",
            //     container: "custpage_fg_basic",
            //     tab: "custpage_tab_main",
            // });

            // form.addField({
            //     id: "custpage_password",
            //     type: serverWidget.FieldType.PASSWORD,
            //     label: "Password",
            //     container: "custpage_fg_basic",
            //     tab: "custpage_tab_main",
            // });

            // form.addField({
            //     id: "custpage_textarea",
            //     type: serverWidget.FieldType.LONGTEXT,
            //     label: "Long Text (textarea)",
            //     container: "custpage_fg_basic",
            //     tab: "custpage_tab_main",
            // })
            // .updateLayoutType({ layoutType: serverWidget.FieldLayoutType.NORMAL });

            // SELECT y MULTISELECT
            // const selectField = form.addField({
            //     id: "custpage_select_opt",
            //     type: serverWidget.FieldType.SELECT,
            //     label: "Select (single)",
            //     container: "custpage_fg_basic",
            //     tab: "custpage_tab_main",
            // });
            // selectField.addSelectOption({
            //     value: "",
            //     text: "--- Seleccione ---",
            //     isSelected: true,
            // });
            // selectField.addSelectOption({ value: "opt1", text: "Opción 1" });
            // selectField.addSelectOption({ value: "opt2", text: "Opción 2" });
            // selectField.addSelectOption({ value: "opt3", text: "Opción 3" });

            // const multiField = form.addField({
            //     id: "custpage_multiselect",
            //     type: serverWidget.FieldType.MULTISELECT,
            //     label: "Multi Select",
            //     container: "custpage_fg_basic",
            //     tab: "custpage_tab_main",
            // });
            // multiField.addSelectOption({ value: "m1", text: "Multi 1" });
            // multiField.addSelectOption({ value: "m2", text: "Multi 2" });
            // multiField.addSelectOption({ value: "m3", text: "Multi 3" });

            // CHECKBOX / RADIO
            // form.addField({
            //     id: "custpage_chk_active",
            //     type: serverWidget.FieldType.CHECKBOX,
            //     label: "Active?",
            //     container: "custpage_fg_basic",
            //     tab: "custpage_tab_main",
            // });

            // // Radio group
            // form.addField({
            //     id: "custpage_radio_a",
            //     type: serverWidget.FieldType.RADIO,
            //     label: "Radio A",
            //     container: "custpage_fg_basic",
            //     tab: "custpage_tab_main",
            // }).defaultValue = "T";

            // form.addField({
            //     id: "custpage_radio_b",
            //     type: serverWidget.FieldType.RADIO,
            //     label: "Radio B",
            //     container: "custpage_fg_basic",
            //     tab: "custpage_tab_main",
            // });

            // CAMPOS NUMÉRICOS, MONEDA, FECHAS
            form.addField({
                id: "custpage_integer",
                type: serverWidget.FieldType.INTEGER,
                label: "Integer",
                container: "custpage_fg_misc",
                tab: "custpage_tab_adv",
            });
            form.addField({
                id: "custpage_float",
                type: serverWidget.FieldType.FLOAT,
                label: "Float",
                container: "custpage_fg_misc",
                tab: "custpage_tab_adv",
            });
            form.addField({
                id: "custpage_currency",
                type: serverWidget.FieldType.CURRENCY,
                label: "Currency",
                container: "custpage_fg_misc",
                tab: "custpage_tab_adv",
            });

            form.addField({
                id: "custpage_date",
                type: serverWidget.FieldType.DATE,
                label: "Date",
                container: "custpage_fg_misc",
                tab: "custpage_tab_adv",
            });

            // form.addField({
            //     id: "custpage_datetime",
            //     type: serverWidget.FieldType.DATETIME,
            //     label: "Date Time",
            //     container: "custpage_fg_misc",
            //     tab: "custpage_tab_adv",
            // });

            form.addField({
                id: "custpage_timeofday",
                type: serverWidget.FieldType.TIMEOFDAY,
                label: "Time of Day",
                container: "custpage_fg_misc",
                tab: "custpage_tab_adv",
            });

            // INLINEHTML
            const inline = form.addField({
                id: "custpage_inline_demo",
                type: serverWidget.FieldType.INLINEHTML,
                label: "Inline HTML Demo",
                container: "custpage_fg_misc",
                tab: "custpage_tab_adv",
            });

            // contenido HTML/JS simple
            inline.defaultValue = `
            <div style="border:1px dashed #999;padding:10px;border-radius:6px;">
                <h3 style="margin:0 0 8px 0;">Tailwind in NetSuite!!!</h3>
                <button id="custpage_btn_inline_click" type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Click me (JS)</button>
                <span id="custpage_inline_result" style="margin-left:12px;font-weight:bold"></span>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
            <script>
                (function(){
                    const btn = document.getElementById('custpage_btn_inline_click');
                    const out = document.getElementById('custpage_inline_result');
                    if(btn && out){
                        btn.addEventListener('click', function(){
                            out.textContent = 'Clicked @ ' + new Date().toLocaleTimeString();
                        });
                    }
                })();
            </script>
        `;

            // SUBLIST (lista tabular) - tipo LIST o INLINEEDITOR
            const sublist = form.addSublist({
                id: "custpage_sublist_demo",
                type: serverWidget.SublistType.LIST,
                label: "Lista de Empleados",
                tab: "custpage_tab_main",
            });

            sublist.addField({
                id: "custpage_col_0",
                type: serverWidget.FieldType.TEXT,
                label: "Col#",
            });

            sublist.addField({
                id: "custpage_col_1",
                type: serverWidget.FieldType.TEXT,
                label: "ID",
            });

            sublist.addField({
                id: "custpage_col_2",
                type: serverWidget.FieldType.TEXT,
                label: "Name",
            });

            sublist.addField({
                id: "custpage_col_3",
                type: serverWidget.FieldType.TEXT,
                label: "Subsidiary",
            });

            sublist.addField({
                id: "custpage_col_4",
                type: serverWidget.FieldType.TEXT,
                label: "Job Title",
            });

            sublist.addField({
                id: "custpage_col_5",
                type: serverWidget.FieldType.TEXT,
                label: "Email",
            });

            const employees = getEmployees();

            for (let i = 0; i < employees.length; i++) {
                sublist.setSublistValue({
                    id: "custpage_col_0",
                    line: i,
                    value: (i + 1).toString(),
                });
                sublist.setSublistValue({
                    id: "custpage_col_1",
                    line: i,
                    value: employees[i].id,
                });
                sublist.setSublistValue({
                    id: "custpage_col_2",
                    line: i,
                    value: new String(employees[i].name),
                });
                sublist.setSublistValue({
                    id: "custpage_col_3",
                    line: i,
                    value: new String(employees[i].subsidiary),
                });
                sublist.setSublistValue({
                    id: "custpage_col_4",
                    line: i,
                    value: new String(employees[i].title),
                });
                sublist.setSublistValue({
                    id: "custpage_col_5",
                    line: i,
                    value: new String(employees[i].email),
                });
            }

            // BOTONES
            form.addSubmitButton({ label: "Enviar" });
            form.addResetButton({ label: "Reset" });

            response.writePage({ pageObject: form });
        };

        return { onRequest };
    });
