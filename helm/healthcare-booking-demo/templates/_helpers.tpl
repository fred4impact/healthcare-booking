{{- define "healthcare-booking-demo.backendServiceName" -}}
{{- printf "%s-healthcare-backend" .Release.Name -}}
{{- end -}}

{{- define "healthcare-booking-demo.frontendServiceName" -}}
{{- printf "%s-healthcare-frontend" .Release.Name -}}
{{- end -}}

{{- define "healthcare-booking-demo.mysqlServiceName" -}}
{{- printf "%s-healthcare-mysql" .Release.Name -}}
{{- end -}}

{{- define "healthcare-booking-demo.postgresServiceName" -}}
{{- printf "%s-healthcare-postgres" .Release.Name -}}
{{- end -}}

{{- define "healthcare-booking-demo.backendPodLabels" -}}
app.kubernetes.io/name: healthcare-backend
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{- define "healthcare-booking-demo.frontendPodLabels" -}}
app.kubernetes.io/name: healthcare-frontend
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{- define "healthcare-booking-demo.mysqlPodLabels" -}}
app.kubernetes.io/name: healthcare-mysql
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{- define "healthcare-booking-demo.postgresPodLabels" -}}
app.kubernetes.io/name: healthcare-postgres
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

