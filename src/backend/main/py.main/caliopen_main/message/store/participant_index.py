# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

import logging

from elasticsearch_dsl import InnerObjectWrapper, Keyword, Text

log = logging.getLogger(__name__)


class IndexedParticipant(InnerObjectWrapper):

    """Nest participant indexed model."""

    address = Keyword()
    contact_id = Keyword()
    label = Text()
    protocol = Keyword()
    type = Keyword()
