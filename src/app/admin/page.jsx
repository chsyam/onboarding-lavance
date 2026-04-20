"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Employees() {
    const router = useRouter();

    useEffect(() => {
        router.push("/admin/employees");
    })

    return (
        <div></div>
    );
}