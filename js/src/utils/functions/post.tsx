export const setFormData = (props: {
  key: string
  value: any
  formId?: string
}) => {
  const formId = props?.formId || 'post'
  const data = props?.value || []
  const key = props?.key || 'unTitled'
  const postForm = document.getElementById(formId) as HTMLFormElement | null
  if (!!postForm) {
    const formData = new FormData(postForm)
    formData.append(key, JSON.stringify(data))

    for (const [
      name,
      value,
    ] of formData.entries()) {
      console.log(name, value)
    }
  }
}
