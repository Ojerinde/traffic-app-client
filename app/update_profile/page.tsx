"use client";
import React, { useEffect } from "react";
import { FormikErrors, useFormik } from "formik";
import * as Yup from "yup";
import { IoIosRemoveCircle } from "react-icons/io";
import { useRouter } from "next/navigation";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";
import HttpRequest from "@/store/services/HttpRequest";
import Link from "next/link";
import { useAppDispatch } from "@/hooks/reduxHook";
import { AddAllCourses } from "@/store/courses/CoursesSlice";
import Navigation from "@/components/Navigation/Navigation";
import InformationInput from "@/components/UI/Input/InformationInput";
import Button from "@/components/UI/Button/Button";
import { emitToastMessage } from "@/utils/toastFunc";

interface Course {
  courseCode: string;
  courseName: string;
}

interface FormValuesType {
  title: string;
  name: string;
  email: string;
  courses: Course[];
}

const UpdateLecturerInformation: React.FC = () => {
  const router = useRouter();
  const loggedInLecturer = GetItemFromLocalStorage("user") || {};
  const dispatch = useAppDispatch();

  const formik = useFormik<FormValuesType>({
    initialValues: {
      name: loggedInLecturer?.name || "",
      email: loggedInLecturer?.email || "",
      title: loggedInLecturer?.title || "",
      courses: loggedInLecturer?.courses || [
        { courseCode: "", courseName: "" },
      ],
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Title is required"),
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .required("Email is required")
        .email("Email is invalid"),
      courses: Yup.array().of(
        Yup.object().shape({
          courseCode: Yup.string()
            .required("Course Code is required")
            .matches(
              /^[A-Z]{3} \d{3}$/,
              "Course must be in the format 'XXX 000'"
            ),
          courseName: Yup.string().required("Course Name is required"),
        })
      ),
    }),

    onSubmit: async (values, actions) => {
      try {
        const response = await HttpRequest.post(`/lecturers`, values);
        actions.resetForm();

        router.push("/dashboard/my_courses");
        emitToastMessage(response.data.message, 'success')
      } catch (error: any) {
        emitToastMessage(error?.response.data.message, 'error')
      } finally {
        actions.setSubmitting(false);
      }
    },
  });

  const handleAddCourse = () => {
    formik.setValues({
      ...formik.values,
      courses: [...formik.values.courses, { courseCode: "", courseName: "" }],
    });
  };

  const removeCourse = (index: number) => {
    if (
      !confirm(
        "Are you sure you want to remove this course? This will delete the course related data"
      )
    )
      return;
    const updatedCourses = [...formik.values.courses];
    updatedCourses.splice(index, 1);
    formik.setValues({
      ...formik.values,
      courses: updatedCourses,
    });
  };

  useEffect(() => {
    const fetchCourses = async () => {
      if (!loggedInLecturer?.email) return;
      try {
        const response = await HttpRequest.get(
          `/courses/${loggedInLecturer.email}`
        );
        if (response.data.courses.length === 0) {
          return emitToastMessage("You have not added any course yet", 'success')
        }
        dispatch(AddAllCourses(response.data.courses));

        const modifiedCourses = response.data.courses.map((course: Course) => ({
          courseCode: course.courseCode,
          courseName: course.courseName,
        }));

        formik.setValues({
          title: loggedInLecturer?.title || "",
          name: loggedInLecturer?.name || "",
          email: loggedInLecturer?.email || "",
          courses: [...modifiedCourses],
        });
      } catch (error: any) {
        emitToastMessage(error?.response.data.message, 'error')

      }
    };

    fetchCourses();
  }, []);

  return (
    <section className="update">
      <Navigation />
      <div className="update-container">
        <div className="update-container__left">
          <Link href="/dashboard" className="continue">
            Continue To Dashboard
          </Link>
          <InformationInput
            id="title"
            type="text"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            inputErrorMessage={formik.errors.title}
            placeholder={formik.values.title}
            readOnly
          />
          <InformationInput
            id="name"
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            inputErrorMessage={formik.errors.name}
            placeholder={formik.values.name}
            readOnly
          />

          <InformationInput
            id="email"
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            inputErrorMessage={formik.errors.email}
            placeholder={formik.values.email}
            readOnly
          />
        </div>
        <div className="update-container__right">
          <form onSubmit={formik.handleSubmit}>
            <div>
              <h2>Update your information.</h2>

              <h3 className="update-container__label">Courses:</h3>
              {formik?.values.courses?.map((course: Course, index: number) => (
                <div className="update-container__courses" key={index}>
                  <div className="left">
                    <InformationInput
                      id={`courseCode${index}`}
                      label="Course Code"
                      type="text"
                      name={`courses[${index}].courseCode`}
                      value={formik.values.courses[index].courseCode}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={
                        (formik.errors.courses as FormikErrors<Course>[])?.[
                          index
                        ]?.courseCode &&
                        formik.touched.courses?.[index]?.courseCode
                      }
                      inputErrorMessage={
                        (formik.errors.courses as FormikErrors<Course>[])?.[
                          index
                        ]?.courseCode
                      }
                    />
                  </div>
                  <div className="right">
                    <InformationInput
                      id={`courseName${index}`}
                      label="Course Name"
                      type="text"
                      name={`courses[${index}].courseName`}
                      value={formik.values.courses[index].courseName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={
                        (formik.errors.courses as FormikErrors<Course>[])?.[
                          index
                        ]?.courseName &&
                        formik.touched.courses?.[index]?.courseName
                      }
                      inputErrorMessage={
                        (formik.errors.courses as FormikErrors<Course>[])?.[
                          index
                        ]?.courseName
                      }
                    />
                  </div>

                  <IoIosRemoveCircle
                    className="icon"
                    onClick={() => removeCourse(index)}
                  />
                </div>
              ))}
              <button
                className="update-container__button"
                type="button"
                onClick={handleAddCourse}
              >
                Add Another Course
              </button>
            </div>
            <Button type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "Updating..." : "Update"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UpdateLecturerInformation;
