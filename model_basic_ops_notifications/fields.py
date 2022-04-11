# -*- coding: utf-8 -*-

import logging

from odoo import fields
from odoo.fields import Default

from .models.mixin import SUPPRESS_NOTIFICATIONS_CTX

_logger = logging.getLogger(__name__)


class One2manyZeroNotifications(fields.One2many):
    def __init__(self, comodel_name=Default, inverse_name=Default, string=Default, **kwargs):
        kwargs["context"] = _update_context(kwargs)
        super().__init__(comodel_name=comodel_name, inverse_name=inverse_name, string=string, **kwargs)


class Many2manyZeroNotifications(fields.Many2many):
    def __init__(
        self, comodel_name=Default, relation=Default, column1=Default, column2=Default, string=Default, **kwargs
    ):
        kwargs["context"] = _update_context(kwargs)
        super().__init__(
            comodel_name=comodel_name, relation=relation, column1=column1, column2=column2, string=string, **kwargs
        )


def _update_context(kwargs):
    context = kwargs.get("context", {}).copy()
    context.update(SUPPRESS_NOTIFICATIONS_CTX)
    return context
