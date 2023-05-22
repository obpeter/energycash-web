import React, {FC} from "react";
import {IonButton, IonContent, IonPage} from "@ionic/react";
import {useForm} from "react-hook-form";
import InputForm from "../components/form/InputForm.component";


const ProfilesPage: FC = () => {

  const testvalues = {firstname: "", lastname: "", age: ""}


  const {handleSubmit, control, formState: {errors}} =
    useForm({defaultValues: testvalues})

  const onValid = (data: any) => console.log(data)

  return (
    <IonPage>
      <IonContent>
        <form onSubmit={handleSubmit(onValid)} id={"submit-test-form"}>
          <InputForm label="firstname" control={control} name="firstname" type={"text"}></InputForm>
          <InputForm label="lastname" control={control} name="lastname" type={"text"}></InputForm>
          <InputForm label="age" control={control} name="age" type={"text"} rules={{pattern: {value: /^[0-9]*$/, message: "Nummer ist gefordert"}}} error={errors.age}></InputForm>
        </form>
        <IonButton form={"submit-test-form"} type="submit">submit</IonButton>
      </IonContent>
    </IonPage>
  )
}

export default ProfilesPage