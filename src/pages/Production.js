import PageTitle from "../components/BasicComponents/PageTitle";
import ProductionItem from "../components/Production/ProductionItem";
import {useOrders} from "../providers/OrdersProvider";
import {Fragment} from "react";

const Production = () => {
    const orders = useOrders();

    const productionItems = orders.map((order, index) => {
        if (order.done_date === null) return <ProductionItem key={index}
                                                             order={order}/>
        else return <Fragment key={index}></Fragment>
    });

    return <>
        <PageTitle name={"Plán výroby"}/>
        <div className={"ProductionPage v-center"}>
            {productionItems}
        </div>
    </>
}

export default Production