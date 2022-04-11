# -*- coding: utf-8 -*-

from odoo import _, models

from .mixin import BASIC_MODEL_OPS_NOTIFICATION_MIXIN_MODEL_NAME, SUPPRESS_NOTIFICATIONS_CTX


class IrCron(models.AbstractModel):
    _inherit = "ir.cron"

    def method_direct_trigger(self):
        """Extend cron job manual execution in order to show a "general purpose" successfull notification only."""

        result = super(IrCron, self.with_context(SUPPRESS_NOTIFICATIONS_CTX)).method_direct_trigger()
        message = f"The cron job{'s were' if len(self) > 1 else ' was'} executed successfully."
        self.env[BASIC_MODEL_OPS_NOTIFICATION_MIXIN_MODEL_NAME]._perform_notification(
            operation="cron job", message=_(message)
        )
        return result
