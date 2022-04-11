# -*- coding: utf-8 -*-

from odoo import models

from .mixin import SUPPRESS_NOTIFICATIONS_CTX


class AutoVacuum(models.AbstractModel):
    _inherit = "ir.autovacuum"

    def _run_vacuum_cleaner(self):
        """Extend the vacuum cleaner to suppress notifications by default"""

        if self._context.get("ignore_notification_suppressing", False):
            return super()._run_vacuum_cleaner()
        return super(AutoVacuum, self.with_context(SUPPRESS_NOTIFICATIONS_CTX))._run_vacuum_cleaner()
