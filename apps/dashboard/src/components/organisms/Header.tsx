import React, { useEffect } from "react";
import type { ReactNode } from "react";
import { Col, notification, Row, Typography } from "antd";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { Link, useHistory, useLocation } from "react-router-dom";

import { ME, MY_PAYMENT_METHODS } from "../../api/queries";
import type { Me } from "../../api/types/Me";
import type { MyPaymentMethods } from "../../api/types/MyPaymentMethods";
import adminroutes from "../../lib/adminRoutes";
import connectionToNodes from "../../lib/connectionToNodes";
import { normalize } from "../../lib/normalize";
import clientRoutes from "../../lib/routes";
import { NewLogo } from "../atoms";
import { HeaderSessionInfo } from "../molecules";
import type { ICreditCardStripe } from "../molecules/CreditCard";

import styles from "./Header.module.css";

const { Text, Title } = Typography;

const routes = [...clientRoutes, ...adminroutes];

interface HeaderProps {
  menu?: ReactNode;
}

const Header = ({ menu }: HeaderProps) => {
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation("translation");
  const { data } = useQuery<Me>(ME);
  const { data: paymentsData } = useQuery<MyPaymentMethods>(MY_PAYMENT_METHODS);

  const card: ICreditCardStripe | undefined =
    (paymentsData?.me?.customer?.paymentMethods &&
      paymentsData?.me?.customer?.defaultPaymentMethod &&
      JSON.parse(
        normalize(
          connectionToNodes(paymentsData?.me?.customer?.paymentMethods).find(
            (payment) =>
              payment.stripeId ===
              paymentsData?.me?.customer?.defaultPaymentMethod?.stripeId
          )?.card!
        )
      )) ||
    undefined;

  useEffect(() => {
    notification.destroy();
    if (location.pathname !== "/profile/edit") {
      card &&
        new Date(card.exp_year, card.exp_month) < new Date() &&
        notification.warning({
          message: t("expiredPayment.message"),
          description: t("expiredPayment.description"),
          duration: 0,
          onClick: () => {
            history.push("/profile/edit");
          },
          style: { cursor: "pointer" },
        });
    }
  }, [card, history, location.pathname, t]);

  let route = routes.find(
    (r) => r.path === location.pathname && r.admin === data?.me?.isStaff
  );

  if (!route) {
    route = routes
      .filter((r) => /:\w+/.exec(r.path))
      .map((r) => {
        const path = r.path.replace(/:\w+/, "");
        return {
          ...r,
          path,
        };
      })
      .find((r) => location.pathname.includes(r.path));
  }

  return (
    <Col xs={{ span: 22, offset: 1 }} lg={{ span: 20, offset: 2 }}>
      <header>
        <Row align="middle">
          <Col span={6} md={5} xs={3}>
            <Link to="/">
              <NewLogo />
            </Link>
          </Col>
          <Col span={12} md={14} xs={18}>
            <Row justify="center">
              <Col>
                {data?.me?.isStaff ? (
                  menu
                ) : (
                  <Title level={1} className={styles.title}>
                    {route?.name && data?.me?.isStaff === route.admin && (
                      <>
                        <Text id={styles.titleIcon}>{">"}</Text>
                        {route?.name}
                      </>
                    )}
                  </Title>
                )}
              </Col>
            </Row>
          </Col>
          <Col span={6} md={5} xs={3}>
            <Row justify="end">
              <Col>
                {" "}
                {data?.me?.email && (
                  <HeaderSessionInfo
                    email={data.me.email}
                    staff={data.me.isStaff}
                  />
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </header>
    </Col>
  );
};

export default Header;
