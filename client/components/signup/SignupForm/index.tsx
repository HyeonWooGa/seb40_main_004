import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useSetRecoilState } from 'recoil';
import {
  userEmailAtom,
  userNickNameAtom,
  userPasswordAtom,
} from '../../../atoms/userAtom';

import { Input } from '../../common/Input';
import { SocialLoginBtn } from '../../common/SocialLoginBtn';
import { Divider } from '../SignupForm/Divider';

type SignUpProps = {
  email: string;
  password: string;
  confirmPassword?: string;
  nickname: string;
};

export const SignUpForm = () => {
  const setEmail = useSetRecoilState(userEmailAtom);
  const setPassword = useSetRecoilState(userPasswordAtom);
  const setNickName = useSetRecoilState(userNickNameAtom);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpProps>();

  const onValid: SubmitHandler<SignUpProps> = ({
    email,
    password,
    confirmPassword,
    nickname,
  }) => {
    if (password !== confirmPassword) {
      setError(
        'confirmPassword',
        { message: '비밀번호가 맞지 않습니다.' },
        { shouldFocus: true },
      );
    } else {
      router.push('/signup-email');
      axios
        .post(`/api/auth/mail`, {
          email,
          password,
          confirmPassword,
          nickname,
        })
        .then(() => {
          setEmail(email);
          setPassword(password);
          setNickName(nickname);
          toast.success(
            '첫번째 단계가 완료되었습니다. 인증번호를 입력해주세요!',
          );
        })
        .catch((error) => {
          console.log('auth error', error);
          toast.error(
            '회원가입에 실패하였습니다..! 다시 한 번 확인해주세요.🥲',
          );
          router.push('/signup');
        });
    }
  };

  return (
    <>
      <form
        className="flex flex-col mx-auto justify-center items-start mt-5"
        onSubmit={handleSubmit(onValid)}
      >
        <div className="space-y-4">
          <Input
            label="닉네임"
            type="text"
            placeholder="닉네임을 입력해주세요."
            register={{
              ...register('nickname', {
                required: '닉네임을 입력해주세요.',
                pattern: {
                  value: /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣].{0,6}$/,
                  message: '자음/모음 1자리 이상, 7자리 이하여야 합니다.',
                },
              }),
            }}
            errors={errors.nickname?.message}
          />

          <Input
            label="이메일"
            type="email"
            placeholder="이메일을 입력해주세요."
            register={{
              ...register('email', {
                required: '이메일을 입력해주세요.',
                pattern: {
                  value: /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i,
                  message: '이메일이 형식에 맞지 않습니다.',
                },
              }),
            }}
            errors={errors.email?.message}
          />

          <Input
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해주세요."
            register={{
              ...register('password', {
                required: '비밀번호를 입력해주세요.',
                pattern: {
                  value:
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()+|=])[A-Za-z\d~!@#$%^&*()+|=]{8,16}$/i,
                  message:
                    '비밀번호는 8~16자, 영어 대소문자,특수문자가 포함되어야 합니다.',
                },
              }),
            }}
            errors={errors.password?.message}
          />

          <Input
            label="비밀번호 확인"
            type="password"
            placeholder="한번 더 입력해주세요."
            register={{
              ...register('confirmPassword', {
                required: '비밀번호를 한번 더 입력해주세요.',
              }),
            }}
            errors={errors.confirmPassword?.message}
          />
        </div>

        <button
          type="submit"
          className="bg-main-yellow bg-opacity-80 hover:bg-opacity-100 p-3 w-full rounded-[20px] font-bold my-5"
        >
          가입하기
        </button>
        <span className="mt-4 text-main-gray text-xs">
          이미 계정이 있으신가요?{' '}
          <Link href="/login">
            <span className="text-blue-500 cursor-pointer hover:text-blue-400">
              로그인
            </span>
          </Link>
        </span>
        <section className="mt-5 w-full">
          <Divider />
          <SocialLoginBtn />
        </section>
      </form>
    </>
  );
};
