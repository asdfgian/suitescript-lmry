<#-- comments in this file ftl -->

<#-- variables -->

<#assign nombre = "Giancarlo">
<#assign edad = 25>
<#assign score = 100>

<#-- functions -->

<#function saludar persona>
    Hola ${persona}!
</#function>

${saludar("Giancarlo")}

<#function addNumbers x y>
<#return x + y>
</#function>

The sum of 10 and 5 is: ${addNumbers(10, 5)}

<#function colorThreshold value upper lower>
<#if value gte upper>
<#return "green">
<#elseif value lt lower>
<#return "red">
<#else>
<#return "yellow">
</#if>
</#function>
${colorThreshold(12, 10, 5)}
${colorThreshold(3, 10, 5)}
${colorThreshold(7, 10, 5)}

<#-- Conditionals -->
<#if edad gt 18>
    Mayor de edad
<#else>
    Menor de edad
</#if>
<#-- other -->
<#if score gt 90>
    Excelente
<#elseif score gt 70>
    Bueno
<#else>
    Insuficiente
</#if>


<#-- Lists -->
<#-- Data model => nombres = ["JSON", "syntax", 1, 2, 3 ] -->
<#list nombres as n>
    - ${n}
</#list>

<#list nombres as n>
    ${n_index}: ${n}
</#list>
<#-- Output
0: JSON
1: syntax
2: 1
3: 2
4: 3

Object list productos = [{"nombre" : "Gian", "precio" : 14 }]
-->
<#list productos as p>
    ${p.nombre} - ${p.precio}
</#list>

<#--Switch-->
<#assign mensajes = {
   "A" : "Tipo A detectado",
   "B" : "Tipo B detectado"
}>

${mensajes[tipo]! "Tipo desconocido"}


