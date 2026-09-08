/// <reference types="react-native-css/types" />

// `react-native-css` 는 RN 컴포넌트 prop 에 `className` 을 module augmentation 으로 붙인다.
// 소비 프로젝트는 `nativewind-env.d.ts`(`/// <reference types="nativewind/types" />`)로 같은 일을
// 하지만, DS 패키지는 nativewind 를 peer 로만 두므로 react-native-css 의 것을 직접 참조한다.
