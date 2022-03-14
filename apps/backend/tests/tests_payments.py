from djstripe.models import Customer

from backend.account.models import AccountStatus

from .utils import (GraphQLTestCase, create_store, get_admin_user,
                    get_normal_user)


class PaymentsTestSuite(GraphQLTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.normal_username, cls.normal_pass, cls.normal_user = get_normal_user()
        cls.admin_username, cls.admin_pass, cls.admin_user = get_admin_user()

    def test_default_account_status_is_registered(self):
        self.assertEqual(self.normal_user.account_status, AccountStatus.REGISTERED)

    def test_when_account_subscribes_its_status_is_PAID_ACCOUNT(self):
        pass

    def test_when_account_subscribes_fails_its_status_is_REGISTERED(self):
        pass

    def test_when_account_subscribes_XXXX_its_status_is_WAITING_PAYMENT(self):
        pass

    def test_when_account_dropout_its_status_is_REGISTERED(self):
        pass

    def test_account_can_not_dropout_if_no_PAID_ACCOUNT(self):
        pass
