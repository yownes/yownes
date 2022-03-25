import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  message,
  Row,
  Tooltip,
  Typography,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import addDays from "date-fns/addDays";
import differenceInHours from "date-fns/differenceInHours";
import { Trans, useTranslation } from "react-i18next";

import { PAY_INVOICE } from "../../api/mutations";
import { InvoiceStatus } from "../../api/types/globalTypes";
import {
  Invoices_invoices_edges_node,
  Invoices_invoices_edges_node_invoiceitems_edges_node,
} from "../../api/types/Invoices";
import {
  MyAccount_me_subscription_invoices_edges_node,
  MyAccount_me_subscription_invoices_edges_node_invoiceitems_edges_node,
} from "../../api/types/MyAccount";
import { PayInvoice, PayInvoiceVariables } from "../../api/types/PayInvoice";
import connectionToNodes from "../../lib/connectionToNodes";
import { currencySymbol } from "../../lib/currencySymbol";
import { getAddress } from "../../lib/getAddress";
import { dateTime, getPeriod } from "../../lib/parseDate";

import {
  AlertWithConfirm,
  Descriptions,
  InvoiceState,
  PaymentsTable,
} from "./";
import { LoadingFullScreen } from "../atoms";

import styles from "./InvoiceInfo.module.css";

const { Text, Title } = Typography;

interface InvoiceInfoProps {
  invoice:
    | MyAccount_me_subscription_invoices_edges_node
    | Invoices_invoices_edges_node;
  staff?: boolean;
}

const InvoiceInfo = ({ invoice, staff }: InvoiceInfoProps) => {
  const { t } = useTranslation();
  const [isPaid, setIsPaid] = useState(false);
  const [payInvoice, { data: payInvoiceData, loading: paying }] = useMutation<
    PayInvoice,
    PayInvoiceVariables
  >(PAY_INVOICE);

  useEffect(() => {
    if (payInvoiceData?.payInvoice?.ok) {
      if (isPaid) {
        message.success(t("client:payInvoiceSubscriptionSuccessful"), 4);
      }
      setIsPaid(false);
    }
  }, [isPaid, payInvoiceData, t]);

  const address = invoice.customer.address
    ? JSON.parse(getAddress(invoice.customer.address))
    : undefined;
  const direction = address
    ? `${address.line1}, ${address.city} - ${address.state} (${address.country})`
    : t("noDirection");

  const period = (
    value:
      | MyAccount_me_subscription_invoices_edges_node_invoiceitems_edges_node
      | Invoices_invoices_edges_node_invoiceitems_edges_node,
    index: number,
    array:
      | MyAccount_me_subscription_invoices_edges_node_invoiceitems_edges_node[]
      | Invoices_invoices_edges_node_invoiceitems_edges_node[]
  ) => {
    const currentPeriod = getPeriod(value.periodStart, value.periodEnd);
    const lastPeriod = getPeriod(
      array[index > 0 ? index - 1 : 0].periodStart,
      array[index > 0 ? index - 1 : 0].periodEnd
    );
    const samePeriod = currentPeriod === lastPeriod && index !== 0;
    if (!samePeriod) {
      return (
        <>
          <Divider className={styles.periodDivider} />
          <Row className={styles.periodContainer}>
            <Col span={12}>
              <Text type="secondary">
                {getPeriod(
                  new Date(value.periodStart),
                  new Date(value.periodEnd)
                )}
              </Text>
            </Col>
          </Row>
        </>
      );
    }
    return null;
  };

  return (
    <Card>
      <Row>
        <Col span={12}>
          <Row justify="start">
            <Title level={5}>{t("invoiceDetails")}</Title>
          </Row>
        </Col>
        <Col span={12}>
          <Row justify="end">
            <Button
              className="button-default-primary"
              download
              href={invoice.invoicePdf}
              type="default"
            >
              {t("downloadInvoice")}
            </Button>
          </Row>
        </Col>
      </Row>
      <Row className={styles.detailsContainer}>
        <Col span={24}>
          <Descriptions
            items={[
              {
                title: t("invoicedTo"),
                description: invoice.customer.name ?? t("noName"),
              },
              {
                title: t("state"),
                description: <InvoiceState state={invoice.status} />,
              },
              {
                title: t("direction"),
                description: direction,
              },
              {
                title: t("billingReason"),
                description: t(
                  `InvoiceBillingReasonShort.${invoice.billingReason}`
                ),
              },
            ]}
          />
        </Col>
      </Row>
      <Row className={styles.summaryContainer} justify="start">
        <Col span={14}>
          <Row justify="start">
            <Text>{t("summary")}</Text>
          </Row>
        </Col>
        <Col span={3}>
          <Row justify="end">
            <Text>{t("quantity")}</Text>
          </Row>
        </Col>
        <Col span={3}>
          <Row justify="end">
            <Text>{t("unitPrice")}</Text>
          </Row>
        </Col>
        <Col span={3}>
          <Row justify="end">
            <Text>{t("amount")}</Text>
          </Row>
        </Col>
      </Row>
      {connectionToNodes(invoice.invoiceitems).map((value, index, array) => (
        <div key={`${new Date()}${value.id}`}>
          {period(value, index, array)}
          <Row className={styles.summaryDetails} justify="start">
            <Col span={14}>
              <Row justify="start">
                <Text>
                  {" · "}
                  {value.description}
                </Text>
              </Row>
            </Col>
            <Col span={3}>
              <Row justify="end">
                <Text>{value.quantity}</Text>
              </Row>
            </Col>
            <Col span={3}>
              <Row justify="end">
                <Text>
                  {!value.proration
                    ? value.price?.unitAmount &&
                      `${(value.price?.unitAmount / 100).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}${currencySymbol(value.currency)}`
                    : null}
                  {}
                </Text>
              </Row>
            </Col>
            <Col span={3}>
              <Row justify="end">
                <Text>
                  {value.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  {currencySymbol(value.currency)}
                </Text>
              </Row>
            </Col>
          </Row>
        </div>
      ))}
      <Divider className={styles.amountDivider} />
      <Row className={styles.amountContainer} justify="start">
        <Col span={20}>
          <Row justify="end">
            <Text>{t("subtotal")}</Text>
          </Row>
        </Col>
        <Col span={3}>
          <Row justify="end">
            <Text>
              {invoice.subtotal.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              {currencySymbol(invoice.currency)}
            </Text>
          </Row>
        </Col>
      </Row>
      {invoice.tax && (
        <Row className={styles.amountContainer} justify="start">
          <Col span={20}>
            <Row justify="end">
              <Text type="secondary">
                {t("taxes")} (
                {invoice.taxPercent ||
                  Math.round(
                    (invoice.total / (invoice.total - invoice.tax) - 1) * 100
                  )}
                %)
              </Text>
            </Row>
          </Col>
          <Col span={3}>
            <Row justify="end">
              <Text>
                {invoice.tax.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                {currencySymbol(invoice.currency)}
              </Text>
            </Row>
          </Col>
        </Row>
      )}
      <Row className={styles.amountContainer} justify="start">
        <Col span={20}>
          <Row justify="end">
            <Text>{t("total")}</Text>
          </Row>
        </Col>
        <Col span={3}>
          <Row justify="end">
            <Text className={styles.totalAmount} strong>
              {invoice.total.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              {currencySymbol(invoice.currency)}
            </Text>
          </Row>
        </Col>
      </Row>
      {invoice.startingBalance !== null &&
      invoice.endingBalance !== null &&
      invoice.startingBalance - invoice.endingBalance !== 0 ? (
        <Row className={styles.amountContainer} justify="start">
          <Col span={20}>
            <Row align="middle" justify="end">
              <Tooltip title={t("apliedBalanceInfo")}>
                <div className={styles.icon}>
                  <InfoCircleOutlined />
                </div>
              </Tooltip>
              <Text type="secondary">{t("appliedBalance")}</Text>
            </Row>
          </Col>
          <Col span={3}>
            <Row justify="end">
              <Text>
                {(
                  (invoice.startingBalance - invoice.endingBalance) /
                  100
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                {currencySymbol(invoice.currency)}
              </Text>
            </Row>
          </Col>
        </Row>
      ) : null}
      {invoice.amountPaid && invoice.amountPaid > 0 ? (
        <Row className={styles.amountContainer} justify="start">
          <Col span={20}>
            <Row justify="end">
              <Text type="secondary">{t("amountPaid")}</Text>
            </Row>
          </Col>
          <Col span={3}>
            <Row justify="end">
              <Text>
                -
                {invoice.amountPaid.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                {currencySymbol(invoice.currency)}
              </Text>
            </Row>
          </Col>
        </Row>
      ) : null}
      <Row className={styles.amountContainer} justify="start">
        <Col span={20}>
          <Row justify="end">
            <Text>{t("amountRemaining")}</Text>
          </Row>
        </Col>
        <Col span={3}>
          <Row justify="end">
            <Text>
              {invoice.amountRemaining !== null &&
                invoice.amountRemaining.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              {currencySymbol(invoice.currency)}
            </Text>
          </Row>
        </Col>
      </Row>
      <Row className={styles.paymentsContainer}>
        <Col span={24}>
          <Row justify="start">
            <Title className={styles.paymentsTitle} level={5}>
              {t("invoicePayments")}
            </Title>
          </Row>
        </Col>
      </Row>
      {invoice.nextPaymentAttempt && invoice.status === InvoiceStatus.DRAFT ? (
        <div className={styles.nextPaymentContainer}>
          <Alert
            message={t("paymentAttempt", {
              amount:
                invoice.amountRemaining !== null &&
                `${invoice.amountRemaining.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}${currencySymbol(invoice.currency)}`,
              date: dateTime(new Date(invoice.nextPaymentAttempt)),
            })}
            showIcon
            type="warning"
          />
        </div>
      ) : (
        invoice.nextPaymentAttempt && (
          <div className={styles.nextPaymentContainer}>
            {staff ? (
              <Alert
                message={t("nextPaymentAttempt", {
                  amount:
                    invoice.amountRemaining !== null &&
                    `${invoice.amountRemaining.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}${currencySymbol(invoice.currency)}`,
                  date: dateTime(new Date(invoice.nextPaymentAttempt)),
                  extra:
                    differenceInHours(
                      addDays(new Date(invoice.created), 7),
                      new Date(invoice.nextPaymentAttempt)
                    ) < 12
                      ? ` ${t("lastIntent")}`
                      : "",
                })}
                showIcon
                type="error"
              />
            ) : (
              <AlertWithConfirm
                buttonText={t("client:payNow")}
                confirmText={
                  <Trans i18nKey={"warnings.retryPayment"} ns="client">
                    <strong></strong>
                    <p></p>
                    <p></p>
                  </Trans>
                }
                message={[
                  t("nextPaymentAttempt", {
                    amount:
                      invoice.amountRemaining !== null &&
                      `${invoice.amountRemaining.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}${currencySymbol(invoice.currency)}`,
                    date: dateTime(new Date(invoice.nextPaymentAttempt)),
                    extra:
                      differenceInHours(
                        addDays(new Date(invoice.created), 7),
                        new Date(invoice.nextPaymentAttempt)
                      ) < 12
                        ? ` ${t("lastIntent")}`
                        : "",
                  }),
                ]}
                onConfirm={() => {
                  payInvoice({
                    variables: {
                      invoiceId: invoice.stripeId || "",
                    },
                    update(cache, { data: payData }) {
                      if (payData?.payInvoice?.ok) {
                        // TODO: update cache
                        console.log("OK: update cache");
                      } else {
                        message.error(
                          t(
                            `client:errors.${payData?.payInvoice?.error}`,
                            t("error")
                          ),
                          4
                        );
                      }
                    },
                  });
                  setIsPaid(true);
                }}
                type="error"
              />
            )}
          </div>
        )
      )}
      <PaymentsTable payments={connectionToNodes(invoice.charges).reverse()} />
      {paying && <LoadingFullScreen tip={t("client:payingInvoice")} />}
    </Card>
  );
};

export default InvoiceInfo;
