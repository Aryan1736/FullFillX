#!/usr/bin/env bash
set -euo pipefail

find_java_home() {
  local java_home
  java_home="$(find /nix/store -maxdepth 1 -type d -name 'openjdk-21*' -print -quit 2>/dev/null || true)"
  if [[ -z "${java_home}" ]]; then
    echo "Java 21 is required but was not found in the Replit environment." >&2
    exit 1
  fi
  printf '%s' "${java_home}"
}

export JAVA_HOME="${JAVA_HOME:-$(find_java_home)}"
export PATH="${JAVA_HOME}/bin:${PATH}"
export SPRING_DOCKER_COMPOSE_ENABLED="${SPRING_DOCKER_COMPOSE_ENABLED:-false}"
export SPRING_JPA_HIBERNATE_DDL_AUTO="${SPRING_JPA_HIBERNATE_DDL_AUTO:-update}"

backend_log="$(mktemp)"
cleanup() {
  if [[ -n "${backend_pid:-}" ]] && kill -0 "${backend_pid}" 2>/dev/null; then
    kill "${backend_pid}" 2>/dev/null || true
    wait "${backend_pid}" 2>/dev/null || true
  fi
  rm -f "${backend_log}"
}
trap cleanup EXIT INT TERM

(
  cd backend
  bash mvnw spring-boot:run
) >"${backend_log}" 2>&1 &
backend_pid=$!

for _ in {1..180}; do
  if curl --silent --fail http://127.0.0.1:8080/actuator/health/readiness >/dev/null 2>&1; then
    break
  fi
  if ! kill -0 "${backend_pid}" 2>/dev/null; then
    cat "${backend_log}" >&2
    exit 1
  fi
  sleep 1
done

if ! curl --silent --fail http://127.0.0.1:8080/actuator/health/readiness >/dev/null 2>&1; then
  cat "${backend_log}" >&2
  echo "Backend did not become ready within 180 seconds." >&2
  exit 1
fi

exec npm --prefix frontend run dev -- --host 0.0.0.0 --port 5000