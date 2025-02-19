"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import Customformfield from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation, UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"
import { FromFieldType } from "./PatientForm"
import { RadioGroup } from "@radix-ui/react-radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { RadioGroupItem } from "../ui/radio-group"
import { Label } from "@radix-ui/react-label"
import { SelectItem } from "../ui/select"
import Image from "next/image";
import FileUploader from "../FileUploader"
import {registerPatient} from '@/lib/actions/patient.actions'


const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, SetIsLoading] = useState(false)

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    SetIsLoading(true);

    // Store file info in form data as
    let formData;
    if (
      values.identificationDocument &&
      values.identificationDocument?.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }

    try {
      const patient = {
        userId: user.$id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        birthDate: new Date(values.birthDate),
        gender: values.gender,
        address: values.address,
        occupation: values.occupation,
        emergencyContactName: values.emergencyContactName,
        emergencyContactNumber: values.emergencyContactNumber,
        primaryPhysician: values.primaryPhysician,
        insuranceProvider: values.insuranceProvider,
        insurancePolicyNumber: values.insurancePolicyNumber,
        allergies: values.allergies,
        currentMedication: values.currentMedication,
        familyMedicalHistory: values.familyMedicalHistory,
        pastMedicalHistory: values.pastMedicalHistory,
        identificationType: values.identificationType,
        identificationNumber: values.identificationNumber,
        identificationDocument: values.identificationDocument
          ? formData
          : undefined,
        privacyConsent: values.privacyConsent,
      };

      const newPatient = await registerPatient(patient);

      if (newPatient) {
        router.push(`/patients/${user.$id}/new-appointment`);
      }
    } catch (error) {
      console.log(error);
    }

    SetIsLoading(false);
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
        </section>

        <Customformfield
          fieldType={FromFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <div className="flex fle-col gap-6 xl-row">
          <Customformfield
            fieldType={FromFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="JohnDoe@gmail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />
          <Customformfield
            fieldType={FromFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone Number"
            placeholder="(555) 123-4567"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">

          <Customformfield
            fieldType={FromFieldType.DATE_PICKER}
            control={form.control}
            name="birthDate"
            label="Date of Birth"
            placeholder="JohnDoe@gmail.com"
          />
          <Customformfield
            fieldType={FromFieldType.SKELETON}
            control={form.control}
            name="gender"
            label="Gender"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup className="flex h-11 gap-6 xl:justify-between" onChange={field.onChange} defaultValue={field.value}>
                  {GenderOptions.map((option) => (
                    <div key={option} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        {/* Address & Occupation */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <Customformfield
            fieldType={FromFieldType.INPUT}
            control={form.control}
            name="address"
            label="Address"
            placeholder="14 street, New york, NY - 5101"
          />

          <Customformfield
            fieldType={FromFieldType.INPUT}
            control={form.control}
            name="occupation"
            label="Occupation"
            placeholder=" Software Engineer"
          />
        </div>

        {/* Emergency Contact Name & Emergency Contact Number */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <Customformfield
            fieldType={FromFieldType.INPUT}
            control={form.control}
            name="emergencyContactName"
            label="Emergency contact name"
            placeholder="Guardian's name"
          />

          <Customformfield
            fieldType={FromFieldType.PHONE_INPUT}
            control={form.control}
            name="emergencyContactNumber"
            label="Emergency contact number"
            placeholder="(555) 123-4567"
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>
        </section>

        <Customformfield
          fieldType={FromFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Primary care physician"
          placeholder="Select a physician"
        >
          {Doctors.map((doctor) => (
            <SelectItem key={doctor.name} value={doctor.name}>
              <div className="flex cursor-pointer items-center gap-2">
                <Image
                  src={doctor.image}
                  width={32}
                  height={32}
                  alt="doctor"
                  className="rounded-full border border-dark-500"
                />
                <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </Customformfield>

        <div className="flex flex-col gap-6 xl:flex-row">
          <Customformfield
            fieldType={FromFieldType.INPUT}
            control={form.control}
            name="insuranceProvider"
            label="Insurance provider"
            placeholder="BlueCross BlueShield"
          />

          <Customformfield
            fieldType={FromFieldType.INPUT}
            control={form.control}
            name="insurancePolicyNumber"
            label="Insurance policy number"
            placeholder="ABC123456789"
          />
        </div>

        {/* ALLERGY & CURRENT MEDICATIONS */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <Customformfield
            fieldType={FromFieldType.TEXTAREA}
            control={form.control}
            name="allergies"
            label="Allergies (if any)"
            placeholder="Peanuts, Penicillin, Pollen"
          />

          <Customformfield
            fieldType={FromFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication"
            label="Current medications"
            placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
          />
        </div>

        {/* FAMILY MEDICATION & PAST MEDICATIONS */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <Customformfield
            fieldType={FromFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory"
            label=" Family medical history (if relevant)"
            placeholder="Mother had brain cancer, Father has hypertension"
          />

          <Customformfield
            fieldType={FromFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalHistory"
            label="Past medical history"
            placeholder="Appendectomy in 2015, Asthma diagnosis in childhood"
          />
        </div>


        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verfication</h2>
          </div>
        </section>

        <Customformfield
          fieldType={FromFieldType.SELECT}
          control={form.control}
          name="identificationType"
          label="Identification Type"
          placeholder="Select identification type"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </Customformfield>

        <Customformfield
          fieldType={FromFieldType.INPUT}
          control={form.control}
          name="identificationNumber"
          label="Identification Number"
          placeholder="123456789"
        />

        <Customformfield
          fieldType={FromFieldType.SKELETON}
          control={form.control}
          name="identificationDocument"
          label="Scanned Copy of Identification Document"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />

      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Consent and Privacy</h2>
        </div>
      </section>

        <Customformfield
          fieldType={FromFieldType.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="I consent to receive treatment for my health condition."
        />

        <Customformfield
          fieldType={FromFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="I consent to the use and disclosure of my health
            information for treatment purposes."
        />

        <Customformfield
          fieldType={FromFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="I acknowledge that I have reviewed and agree to the
            privacy policy"
        />

      <SubmitButton isLoading={isLoading}> Get Started</SubmitButton>
    </form>
    </Form >
  )
}

export default RegisterForm;