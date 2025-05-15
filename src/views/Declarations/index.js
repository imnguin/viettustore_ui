import User from "./User";
import Test from "./Test"
import Product from "./Product";
import QuantityUnit from "./QuantityUnit";
import Brand from "./Brand";
import Branch from "./Branch";
import Area from "./Area";
export const routes = [
    ...Area,
    ...Branch,
    ...Brand,
    ...QuantityUnit,
    ...Product,
    ...User,
    ...Test
];