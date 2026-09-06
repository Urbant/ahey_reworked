# Границы переноса WebRTC (до внесения изменений)

Основа — пользовательская версия reworked; источник ядра — второй предоставленный архив.

Изменить: public/peer.js (предпочтения кодеков без переписывания SDP), server/signalling-server.js (защищённые словари, проверка членства, очистка комнат), init.js (динамический ICE до static), server/config.js (TURN), scripts/pre-start.js (убрать запись и логирование постоянных TURN-паролей), public/ice-config.js (убрать статический файл), public/sw.js (не кэшировать временные credentials).

Добавить: server/turn.js, coturn/entrypoint.sh, coturn/turnserver.conf.

Адаптация: сохранить channel и интерфейс App, проверить существование конференции через существующий сервис БД. Сохранить старые переменные TURN для совместимости. Не переносить публичные комнаты, random, лимит 4 участников, новую структуру assets, Caddy или замену Docker-топологии.

Не менять бизнес-логику server/db.js, server/services/conferences.js, server/middleware/botAuth.js и API маршрутов. Вторым этапом — оформление, метаданные, ресурсы и технические имена бренда.
