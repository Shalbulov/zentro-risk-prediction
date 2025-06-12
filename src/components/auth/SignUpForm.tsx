import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";

import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ✅ Схема валидации
const schema = yup.object().shape({
  firstName: yup
    .string()
    .required("Имя обязательно")
    .test(
      "only-letters",
      "Имя должно содержать только буквы",
      (value) => /^[A-Za-zА-Яа-яЁё\s-]+$/.test(value || "")
    ),
  lastName: yup
    .string()
    .required("Фамилия обязательна")
    .test(
      "only-letters",
      "Фамилия должна содержать только буквы",
      (value) => /^[A-Za-zА-Яа-яЁё\s-]+$/.test(value || "")
    ),
  email: yup
    .string()
    .required("Email обязателен")
    .email("Введите корректный email"),
  password: yup
    .string()
    .required("Пароль обязателен")
    .min(8, "Пароль должен быть не менее 8 символов")
    .test(
      "has-lowercase",
      "Пароль должен содержать хотя бы одну строчную букву",
      (value) => /[a-z]/.test(value || "")
    )
    .test(
      "has-uppercase",
      "Пароль должен содержать хотя бы одну заглавную букву",
      (value) => /[A-Z]/.test(value || "")
    )
    .test(
      "has-number",
      "Пароль должен содержать хотя бы одну цифру",
      (value) => /\d/.test(value || "")
    )
    .test(
      "has-special",
      "Пароль должен содержать хотя бы один спецсимвол",
      (value) => /[@$!%*?&/#^()+\-]/.test(value || "")
    ),
});

export default function SignUpForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const passwordValue = useWatch({ control, name: "password" });

  const passwordRules = [
    {
      id: 1,
      label: "Минимум 8 символов",
      isValid: (val: string) => val.length >= 8,
    },
    {
      id: 2,
      label: "Хотя бы одна строчная буква",
      isValid: (val: string) => /[a-z]/.test(val),
    },
    {
      id: 3,
      label: "Хотя бы одна заглавная буква",
      isValid: (val: string) => /[A-Z]/.test(val),
    },
    {
      id: 4,
      label: "Хотя бы одна цифра",
      isValid: (val: string) => /\d/.test(val),
    },
    {
      id: 5,
      label: "Хотя бы один спецсимвол (@$!%*?&/#^()+-)",
      isValid: (val: string) => /[@$!%*?&/#^()+\-]/.test(val),
    },
  ];

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const response = await res.json();

      if (res.ok) {
        alert("🎉 Регистрация прошла успешно!");
        navigate("/signin");
      } else {
        alert(response.message || "Ошибка при регистрации");
      }
    } catch (err) {
      console.error(err);
      alert("🚨 Ошибка соединения с сервером");
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Назад к панели
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Регистрация
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Введите ваш email и пароль, чтобы создать аккаунт
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              {/* Имя и фамилия */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <Label>
                    Имя<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Введите имя"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="sm:col-span-1">
                  <Label>
                    Фамилия<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Введите фамилию"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <Label>
                  Email<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="Введите email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Пароль */}
              <div>
                <Label>
                  Пароль<span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Введите пароль"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}

                {/* ✅ Блок визуализации требований */}
                <ul className="mt-3 space-y-2 text-sm">
                  {passwordRules.map((rule) => {
                    const valid = rule.isValid(passwordValue || "");
                    return (
                      <li key={rule.id} className="flex items-center gap-2">
                        <Checkbox
                          className="w-4 h-4"
                          checked={valid}
                          disabled
                        />
                        <span className={`${valid ? "text-green-600" : "text-gray-500"}`}>
                          {rule.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Согласие с условиями */}
              <div className="flex items-center gap-3">
                <Checkbox
                  className="w-5 h-5"
                  checked={isChecked}
                  onChange={setIsChecked}
                />
                <p className="inline-block font-normal text-gray-800 dark:text-white">
                  Регистрируясь, вы соглашаетесь с условиями использования и политикой конфиденциальности
                </p>
              </div>

              {/* Кнопка */}
              <div>
                <button
                  type="submit"
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                >
                  Зарегистрироваться
                </button>
              </div>
            </div>
          </form>

          {/* Уже есть аккаунт */}
          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Уже есть аккаунт?{" "}
              <Link
                to="/signin"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
