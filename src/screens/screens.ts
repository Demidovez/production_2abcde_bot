import { EPageType, IScreen } from "../types/types";

interface IProp {
  [key: string]: IScreen;
}

const screens: IProp = {
  PRODUCTION: { link: "Product_info_2ABC.htm", type: EPageType.photo },
  TREND: { link: "Product_info_trend_2ABC.htm", type: EPageType.photo },
};

export default screens;
