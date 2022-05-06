import React from "react";
import { Card, Col, Row } from "antd";

import { AdminData, ChangePassword } from "../../components/organisms";

const Profile = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col
        xs={{ span: 22, offset: 1 }}
        sm={{ span: 20, offset: 2 }}
        md={{ span: 18, offset: 3 }}
        lg={{ span: 16, offset: 4 }}
      >
        <AdminData />
      </Col>
      <Col
        xs={{ span: 22, offset: 1 }}
        sm={{ span: 20, offset: 2 }}
        md={{ span: 18, offset: 3 }}
        lg={{ span: 16, offset: 4 }}
      >
        <Card>
          <ChangePassword />
        </Card>
      </Col>
    </Row>
  );
};

export default Profile;
