/**
 * Voronka bosqichlari va hodisa nomlari.
 *
 * Bir joyda turgani muhim: bazadagi `funnel_stage` va `event_type` qiymatlari
 * API javoblarida ham, statistikada ham ishlatiladi — matnni har joyda qo'lda
 * yozish kelajakda mos kelmaydigan qiymatlarga olib keladi.
 */

const STAGES = {
  STARTED: 'started',
  AWAITING_SUBSCRIPTION: 'awaiting_subscription',
  SUBSCRIBED: 'subscribed',
  AWAITING_PHONE: 'awaiting_phone',
  PHONE_SHARED: 'phone_shared',
  COMPLETED: 'completed',
};

/** Voronka tartibi — /stats va API konversiyasi shu ketma-ketlikda hisoblanadi. */
const STAGE_ORDER = [
  STAGES.STARTED,
  STAGES.AWAITING_SUBSCRIPTION,
  STAGES.SUBSCRIBED,
  STAGES.AWAITING_PHONE,
  STAGES.PHONE_SHARED,
  STAGES.COMPLETED,
];

const EVENTS = {
  START: 'start',
  BEGIN_CLICKED: 'begin_funnel_clicked',
  COURSE_VIEWED: 'course_viewed',
  SUBSCRIPTION_REQUIRED: 'subscription_required',
  SUBSCRIPTION_CONFIRMED: 'subscription_confirmed',
  SUBSCRIPTION_FAILED: 'subscription_check_failed',
  PHONE_REQUESTED: 'phone_requested',
  PHONE_SHARED: 'phone_shared',
  PHONE_SKIPPED: 'phone_skipped',
};

module.exports = { STAGES, STAGE_ORDER, EVENTS };
