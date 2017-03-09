![Alt text](http://g.gravizo.com/g?
@startuml;
title Transaction - Sell BitCoin;

participant CoolWallet as cw;
participant App as app;
participant User as u;
participant Exchange as ex;
participant Block_chain as bc;

u->ex: Place sell order;
ex->bc: check balance\n and open order;
ex->ex: schedule scan open order balance;
ex->ex: prepare order;
ex->app: Notify bitcoin block\n%28transaction IDs, block info%29;
note right of ex;
alert unfinished\norder status;
end note;
app->u: notify;
u->app: awake app;
app->ex: request order info;
app->cw:gen OTP ;
cw->u:OTP;
alt;
u->app: user enters OTP;
app->ex: request order block sign %28OTP%29;
ex-->app: ?;
app->cw: block the amount;
cw-->app: %28ok token%29;
app->ex: block complete %28ok token%29;
ex->ex: Order created\notp to decrypt ok token;
ex-->u: Order created;
else;
u->app: user cancel order;
app->cw: cancel order;
app->ex: cancel order;
ex->ex: order canceled;
end;
deactivate app;

alt balance scan;
app->ex: update account addresses;
ex->bc: check balance\n%28if ng, suspend all orders%29;
end;
ex->ex: buyer found;
ex->ex: trx aggregation%281 min%29;
note right of ex;
%28order canceled;
if not fufill;
within 12 hours.;
%28unblock flow%29.;
notifyretry \nin 6 hours%29;
end note;
ex->app: Notify bitcoin transfer\n%28Order ID%29;
app->u: notify;
u->app: awake app;
deactivate ex;
app->ex: get trx ids, address%28es%29 ok token%28order ID%29;

app-->u: wait for user\n confirmation%28Trx detail%29;
u->app: confirm transaction\n %28with in 12 hours%29;

app->cw: check trx authenticity\n%28login%29;

app->cw: get transfer block\n and signature/;
app->bc: submit transaction;
app->ex: transaction submitted%28trx id%29;
ex->ex: order state changed to\n 'waiting for transafer';

note right of ex;
%28waiting for\nconfirmation%29;
end note;

note right of ex;
%28How to confirm,TBC%29;
end note;

ex->bc: 6 confirmations?;
Activate ex;
ex->ex: Order complete;
ex->ex: trx fees and clearing;
ex->ex: notification \n%28notification / email%29;

@enduml
)
