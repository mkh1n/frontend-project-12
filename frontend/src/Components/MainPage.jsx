import MainContainer from "./MainContainer";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCurrentUser } from "../slices/authSlice";

export default () => {
  const currentUser = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (!userString) {
      navigate("login");
    } else {
      const user = JSON.parse(userString);
      if (!currentUser) {
        dispatch(setCurrentUser({ username: user.username, token: user.token }));
      }
    }

    // Добавляем проверку, что состояние Redux обновлено
    if (currentUser) {
      console.log(currentUser);
    }
  }, [currentUser, dispatch, navigate]);

  return (
    <MainContainer>
      Главная Страница
      текущий пользователь {currentUser ? currentUser : "загрузка..."}
    </MainContainer>
  )
}