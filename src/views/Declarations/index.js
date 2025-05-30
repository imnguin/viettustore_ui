import User from "./User";
import Test from "./Test"
import Product from "./Product";
import QuantityUnit from "./QuantityUnit";
import Brand from "./Brand";
import Branch from "./Branch";
import Area from "./Area";
import Price from "./Price";
import Product_lot from "./Product_lot";
import Promotion from "./Promotion";
export const routes = [
    ...Promotion,
    ...Product_lot,
    ...Price,
    ...Area,
    ...Branch,
    ...Brand,
    ...QuantityUnit,
    ...Product,
    ...User,
    ...Test
];