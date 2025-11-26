<#----------------------------------------------------------------->
<#function formatNumber10 value >
<#assign value10 = value?upper_case>
<#assign value10 = setPadding(value10,"left","0",20)>
<#assign value10 = value10?substring(value10?length-10,value10?length)>
<#assign value10 = value10?replace('ABCDEFGHIJKLMNÑOPQRSTUVWYZ','0','r')>
<#return value10>
</#function>
<#----------------------------------------------------------------->
<#assign cbank = company.bank >
<#assign c_cuenta= setPadding(cbank.custrecord_lmry_cbank_acc_num,"right"," ",20) >
<#assign moneda_trans = getCurrencySymbol(cbank.custrecord_lmry_cbank_currency) >
<#if (moneda_trans ="PEN") >
<#assign moneda_trans = "0001">
<#else>
<#assign moneda_trans = "1001">
</#if>
<#assign fec_emision = .now?string("yyyyMMdd")>
<#assign totalAmount = 0 >
<#assign checksum = formatNumber10(cbank.custrecord_lmry_cbank_acc_num)?number >
<#list payments as payment>
<#assign totalAmount += getPaymentAmount(payment) >
</#list>
<#assign totalAmount = setPadding(formatCurrency(totalAmount,"dec"),"left","0",17)>
<#list payments as payment>
<#assign ebank = payment.bank >
<#assign excRate = payment.exchangerate?abs >
<#assign num_e_cuenta = formatNumber10(ebank.custrecord_lmry_ebank_acc_num)?number >
<#assign checksum += num_e_cuenta >
</#list>
<#assign checksum = setPadding(checksum?string["0"],"left","0",15) >
<#assign lineCount = payments?size />
<#assign lineCount = setPadding(lineCount?string["#"],"left","0",6) />
1${lineCount}${fec_emision}C${moneda_trans}${c_cuenta}${totalAmount}${setPadding("PAGO PROVEEDORES","right"," ",40)}N${checksum}
<#list payments as payment>
<#assign ebank = payment.bank>
<#assign entity = payment.entity>
<#assign excRate = payment.exchangerate?abs >
<#assign e_cuenta = setPadding(ebank.custrecord_lmry_ebank_acc_num,"right"," ",20)>
<#assign e_cuenta_tipo = ebank.custrecord_lmry_ebank_acc_type?substring(0,1) >
<#assign e_doc_tipo = ebank.custrecord_lmry_ebank_entity_tax_id_type?upper_case >
<#switch e_doc_tipo>
<#case "DOCUMENTO NACIONAL DE IDENTIDAD (DNI)">
<#assign e_doc_tipo = "1" >
<#break>
<#case "CARNET DE EXTRANJERIA">
<#assign e_doc_tipo = "3" >
<#break>
<#case "PASAPORTE">
<#assign e_doc_tipo = "4" >
<#break>
<#case "REGISTRO ÚNICO DE CONTRIBUYENTES">
<#assign e_doc_tipo = "6" >
<#break>
<#default>
<#assign e_doc_tipo = "0">
</#switch>
<#if entity.vatregnumber?has_content>
<#assign e_doc_num = setPadding(entity.vatregnumber,"right"," ",12)>
<#else>
<#assign e_doc_num = setPadding(entity.custentity_lmry_ste_tax_reg_number,"right"," ",12)>
</#if>
<#assign e_doc_num = setPadding(ebank.custrecord_lmry_ebank_entity_tax_id,"right"," ",12)>
<#assign isperson = entity.isperson >
<#if (isperson)>
<#assign e_nombre = replaceLatinText(entity.firstname+" "+entity.lastname)>
<#else>
<#assign e_nombre = replaceLatinText(entity.companyname)>
</#if>
<#assign e_nombre = setPadding(e_nombre,"right"," ",75)>
<#assign e_monto = setPadding(formatCurrency(getPaymentAmount(payment),"dec"),"left","0",17) >
<#assign e_note_c = setPadding("PAGO PROVEEDOR","right"," ",40) >
<#assign e_note_e = setPadding("Nro: "+ transfer.id?string.number,"right"," ",20) >
2${e_cuenta_tipo}${e_cuenta}1${e_doc_tipo}${e_doc_num} ${e_nombre}${e_note_c}${e_note_e}${moneda_trans}${e_monto}N
<#list payment.transactions as transaction>
<#assign e_monto_parcial = setPadding(formatCurrency(getAmount(payment,transaction),"dec"),"left","0",17) >
<#if transaction.custbody_lmry_num_preimpreso?has_content>
<#assign e_trans_num = setPadding(transaction.custbody_lmry_num_preimpreso,"left","0",15) >
<#elseif transaction.custbody_lmry_ste_preprinted_number?has_content>
<#assign e_trans_num = setPadding(transaction.custbody_lmry_ste_preprinted_number,"left","0",15) >
<#else>
<#assign e_trans_num = setPadding(transaction.tranid,"left","0",15) >
</#if>
3F${e_trans_num}${e_monto_parcial}
</#list>
</#list>